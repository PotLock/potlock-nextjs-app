import { Big } from "big.js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { indexerClient } from "@/common/api/indexer";
import { PRICES_REQUEST_CONFIG, intearPricesClient } from "@/common/api/intear-prices";
import { is_human } from "@/common/contracts/core/sybil";
import { AccountId, type ElectionId, Vote } from "@/common/contracts/core/voting";
import { ftClient } from "@/common/contracts/tokens/ft";

import { VOTING_ROUND_CONFIG_MPDAO } from "./hardcoded";
import type { VoterProfile, VotingRoundCandidateResult } from "../types";

type VotingRoundCandidateIntermediateResult = {
  accountId: string;
  accumulatedWeight: Big;
};

type VotingRoundCandidateIntermediateRegistry = {
  candidates: Record<AccountId, VotingRoundCandidateIntermediateResult>;
};

type VotingRoundCandidateResultRegistry = {
  candidates: Record<AccountId, VotingRoundCandidateResult>;
};

interface VotingRoundResultsState {
  resultsCache: Record<
    ElectionId,
    VotingRoundCandidateResultRegistry & {
      totalVoteCount: number;
      leadingPositionAccountIds: AccountId[];
    }
  >;

  updateResults: (params: {
    electionId: number;
    votes: Vote[];
    matchingPoolBalance: Big;
  }) => Promise<void>;
}

export const useRoundResultsStore = create<VotingRoundResultsState>()(
  persist(
    (set) => ({
      resultsCache: {},

      updateResults: async ({ electionId, votes, matchingPoolBalance }) => {
        const {
          stakingContractAccountId,
          initialWeight,
          basicWeight,
          voteWeightAmplificationRules,
        } = VOTING_ROUND_CONFIG_MPDAO;

        const uniqueVoterAccountIds = [
          ...new Set(votes.map(({ voter: voterAccountId }) => voterAccountId)),
        ];

        const voterProfiles: Record<AccountId, VoterProfile> = {};

        await Promise.all(
          uniqueVoterAccountIds.map(async (voterAccountId) => {
            const { data: voterInfo } = await indexerClient
              .v1MpdaoVoterInfoRetrieve({ voter_id: voterAccountId })
              .catch(() => ({ data: undefined }));

            const votingPower = voterInfo
              ? voterInfo?.locking_positions.reduce(
                  (sum: Big, { voting_power }: { voting_power: string }) =>
                    sum.add(Big(voting_power)),

                  Big(0),
                )
              : Big(0);

            const isHumanVerified = await is_human({ account_id: voterAccountId }).catch(
              () => false,
            );

            const stakingTokenMetadata = stakingContractAccountId
              ? await ftClient.ft_metadata({
                  tokenId: stakingContractAccountId,
                })
              : null;

            const stakingTokenBalance =
              stakingContractAccountId && stakingTokenMetadata
                ? await ftClient
                    .ft_balance_of({ accountId: voterAccountId, tokenId: stakingContractAccountId })
                    .then((balance) => Big(balance || 0))
                    .catch(() => undefined)
                : undefined;

            const stakingTokenBalanceUsd =
              stakingContractAccountId && stakingTokenBalance
                ? await intearPricesClient
                    .getSuperPrecisePrice(
                      { token_id: stakingContractAccountId },
                      PRICES_REQUEST_CONFIG.axios,
                    )
                    .then(({ data: price }) => Big(price).mul(stakingTokenBalance))
                    .catch(() => undefined)
                : undefined;

            voterProfiles[voterAccountId] = {
              isHumanVerified,
              votingPower,
              stakingTokenBalance,
              stakingTokenBalanceUsd,
            };
          }),
        );

        // Helper function to calculate voter's weight based on their profile
        const calculateVoterWeight = (voterAccountId: AccountId) => {
          const profile = voterProfiles[voterAccountId];
          if (!profile) return Big(initialWeight);

          let weight = Big(initialWeight);

          // Apply amplification rules
          voteWeightAmplificationRules.forEach((rule) => {
            const profileParameter = profile[rule.voterProfileParameter];

            let isApplicable = false;

            switch (rule.comparator) {
              case "boolean": {
                if (typeof profileParameter === "boolean") {
                  isApplicable = profileParameter === rule.expectation;
                }

                break;
              }

              default: {
                if (profileParameter instanceof Big) {
                  isApplicable = profileParameter[rule.comparator](rule.threshold);
                }
              }
            }

            if (isApplicable) {
              weight = weight.add(
                Big(rule.amplificationPercent)
                  .div(100)
                  .mul(basicWeight ?? (weight.gt(0) ? weight : 1)),
              );
            }
          });

          return weight;
        };

        // Group votes by candidate
        const votesByCandidate = votes.reduce<Record<AccountId, Vote[]>>((acc, vote) => {
          if (!acc[vote.candidate_id]) {
            acc[vote.candidate_id] = [];
          }

          acc[vote.candidate_id].push(vote);
          return acc;
        }, {});

        // First pass: Calculate accumulated weights for each candidate
        const intermediateResults = Object.entries(votesByCandidate).reduce<
          VotingRoundCandidateIntermediateRegistry["candidates"]
        >((acc, [candidateAccountId, candidateVotes]) => {
          // Calculate total weight for this candidate
          const accumulatedWeight = candidateVotes.reduce((sum, vote) => {
            const voterWeight = calculateVoterWeight(vote.voter);
            return sum.plus(Big(vote.weight).mul(voterWeight));
          }, Big(0));

          // Store intermediate results with Big.js precision
          acc[candidateAccountId as AccountId] = {
            accountId: candidateAccountId,
            accumulatedWeight: accumulatedWeight,
          };

          return acc;
        }, {});

        // Calculate total accumulated weight across all candidates
        const totalAccumulatedWeight = Object.values(intermediateResults).reduce(
          (sum, result) => sum.add(result.accumulatedWeight),
          Big(0),
        );

        // Second pass: Calculate estimated payouts using total accumulated weight
        const candidateResults = Object.entries(intermediateResults).reduce<
          VotingRoundCandidateResultRegistry["candidates"]
        >((acc, [candidateAccountId, result]) => {
          acc[candidateAccountId as AccountId] = {
            ...result,
            accumulatedWeight: result.accumulatedWeight.toNumber(),
            estimatedPayoutAmount: matchingPoolBalance
              .mul(result.accumulatedWeight.div(totalAccumulatedWeight))
              .toNumber(),
          };

          return acc;
        }, {});

        set((state) => ({
          resultsCache: {
            ...state.resultsCache,

            [electionId]: {
              totalVoteCount: votes.length,
              candidates: candidateResults,

              leadingPositionAccountIds: Object.values(candidateResults)
                .sort((a, b) => b.accumulatedWeight - a.accumulatedWeight)
                .slice(0, 3)
                .map(({ accountId }) => accountId),
            },
          },
        }));
      },
    }),

    {
      name: "potlock-voting-round-results",
    },
  ),
);
