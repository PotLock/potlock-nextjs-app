import { Big } from "big.js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { indexerClient } from "@/common/api/indexer";
import { getIsHuman } from "@/common/contracts/core/sybil";
import { AccountId, type ElectionId, Vote } from "@/common/contracts/core/voting";
import { ftClient } from "@/common/contracts/tokens/ft";

import { VOTING_MECHANISM_CONFIG_MPDAO } from "./hardcoded";
import type { VoterProfile, VotingRoundCandidateResult } from "../types";

type VotingRoundCandidateResultRegistry = {
  candidates: Record<AccountId, VotingRoundCandidateResult>;
};

interface VotingRoundResultsState {
  resultsCache: Record<ElectionId, VotingRoundCandidateResultRegistry & { totalVoteCount: number }>;

  updateResults: (params: {
    electionId: number;
    votes: Vote[];
    matchingPoolBalance: number;
  }) => Promise<void>;
}

const useRoundResultsStore = create<VotingRoundResultsState>()(
  persist(
    (set) => ({
      resultsCache: {},

      updateResults: async ({ electionId, votes, matchingPoolBalance }) => {
        const {
          stakingContractAccountId,
          initialWeight,
          basicWeight,
          voteWeightAmplificationRules,
        } = VOTING_MECHANISM_CONFIG_MPDAO;

        // Get unique voters
        const uniqueVoters = [...new Set(votes.map((vote) => vote.voter))];

        // Fetch voter profiles
        const voterProfiles: Record<AccountId, Omit<VoterProfile, "stakingTokenBalanceUsd">> = {};

        await Promise.all(
          uniqueVoters.map(async (voterAccountId) => {
            // Fetch voter info using the generated client
            const { data: voterInfo } = await indexerClient
              .v1MpdaoVoterInfoRetrieve({ voter_id: voterAccountId })
              .catch(() => ({ data: undefined }));

            // Calculate voting power from positions
            const votingPower = voterInfo
              ? voterInfo?.locking_positions.reduce(
                  (sum: Big, { voting_power }: { voting_power: string }) =>
                    sum.add(Big(voting_power)),
                  Big(0),
                )
              : Big(0);

            // Get human verification status from sybil contract
            const isHumanVerified = await getIsHuman({ account_id: voterAccountId });

            const stakingTokenMetadata = stakingContractAccountId
              ? await ftClient.ft_metadata({
                  tokenId: stakingContractAccountId,
                })
              : null;

            // Get staking token balance
            const stakingTokenBalance =
              stakingContractAccountId && stakingTokenMetadata
                ? await ftClient
                    .ft_balance_of({ accountId: voterAccountId, tokenId: stakingContractAccountId })
                    .then((balance) => Big(balance || 0))
                    .catch(() => undefined)
                : undefined;

            voterProfiles[voterAccountId] = {
              isHumanVerified,
              votingPower,
              stakingTokenBalance,
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
            let isApplicable = false;

            if (rule.comparator === "isTruthy") {
              // Handle boolean comparisons
              const boolValue = profile[rule.voterProfileParameter as "isHumanVerified"];
              isApplicable = Boolean(boolValue) === rule.expectation;
            } else {
              // Handle numeric comparisons
              const numValue =
                profile[rule.voterProfileParameter as "stakingTokenBalance" | "votingPower"];

              if (numValue instanceof Big) {
                isApplicable = numValue[rule.comparator](rule.threshold);
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

        // Calculate accumulated weights and store results
        const candidateResults = Object.entries(votesByCandidate).reduce<
          VotingRoundCandidateResultRegistry["candidates"]
        >((acc, [candidateAccountId, candidateVotes]) => {
          // Calculate total weight for this candidate
          const accumulatedWeight = candidateVotes.reduce((sum, vote) => {
            const voterWeight = calculateVoterWeight(vote.voter);
            return sum.plus(Big(vote.weight).mul(voterWeight));
          }, Big(0));

          // Store results
          acc[candidateAccountId as AccountId] = {
            accountId: candidateAccountId,
            accumulatedWeight: accumulatedWeight.toNumber(),

            // TODO: Requires further consideration
            // Calculate estimated payout based on relative weight
            estimatedPayoutAmount: Big(matchingPoolBalance)
              .mul(accumulatedWeight.div(votes.length))
              .toNumber(),
          };

          return acc;
        }, {});

        set((state) => ({
          resultsCache: {
            ...state.resultsCache,
            [electionId]: { totalVoteCount: votes.length, candidates: candidateResults },
          },
        }));
      },
    }),

    {
      name: "potlock-voting-round-results",
    },
  ),
);

/**
 * Hook to get computed round results for a specific election
 */
export const useRoundResults = ({
  electionId,
  matchingPoolBalance,
  votes,
}: {
  electionId: number;
  matchingPoolBalance: number;
  votes?: Vote[];
}) => {
  const store = useRoundResultsStore();

  // Update results if votes have changed
  if (votes) {
    const cachedResults = store.resultsCache[electionId];

    if (!cachedResults || cachedResults.totalVoteCount !== votes.length) {
      store.updateResults({ electionId, votes, matchingPoolBalance });
    }
  }

  return store.resultsCache[electionId]?.candidates;
};
