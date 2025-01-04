import { Big } from "big.js";
import { fromEntries } from "remeda";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type MpdaoVoterItem, indexerClient } from "@/common/api/indexer";
import { INDEXER_CLIENT_CONFIG } from "@/common/api/indexer/internal/config";
import { is_human } from "@/common/contracts/core/sybil";
import { AccountId, type ElectionId, Vote } from "@/common/contracts/core/voting";
import { ftClient } from "@/common/contracts/tokens/ft";
import { stringifiedU128ToBigNum } from "@/common/lib";

import type { VoterProfile, VotingMechanismConfig, VotingRoundWinner } from "../types";
import { getVoteWeight } from "../utils/vote-weight";

type VotingRoundWinnerIntermediateData = Pick<VotingRoundWinner, "accountId" | "voteCount"> & {
  accumulatedWeight: Big;
};

type VotingRoundParticipants = {
  voterRegistry: Record<AccountId, VoterProfile>;
  winnerRegistry: Record<AccountId, VotingRoundWinner>;
};

interface VotingRoundResultsState {
  resultsCache: Record<ElectionId, VotingRoundParticipants & { totalVoteCount: number }>;

  updateResults: (params: {
    electionId: number;
    votes: Vote[];
    voters: MpdaoVoterItem[];
    matchingPoolBalance: Big;
    mechanismConfig: VotingMechanismConfig;
  }) => Promise<void>;
}

export const useRoundResultsStore = create<VotingRoundResultsState>()(
  persist(
    (set) => ({
      resultsCache: {},

      updateResults: async ({ electionId, votes, matchingPoolBalance, mechanismConfig }) => {
        const stakingTokenMetadata = mechanismConfig.stakingContractAccountId
          ? await ftClient.ft_metadata({ tokenId: mechanismConfig.stakingContractAccountId })
          : null;

        const voterRegistry: VotingRoundParticipants["voterRegistry"] | undefined =
          await indexerClient
            .v1MpdaoVotersRetrieve({ page_size: 90 }, INDEXER_CLIENT_CONFIG.axios)
            .then(async ({ data }) => {
              console.log(data);

              const voterEntries = await Promise.all(
                data.results.map(async ({ voter_id, voter_data }) => {
                  const votingPower =
                    voter_data.locking_positions?.reduce(
                      (sum: Big, { voting_power }: { voting_power: string }) =>
                        sum.add(Big(voting_power)),
                      Big(0),
                    ) ?? Big(0);

                  const isHumanVerified = await is_human({ account_id: voter_id }).catch(
                    () => false,
                  );

                  const stakingTokenBalance = voter_data.staking_token_balance
                    ? stringifiedU128ToBigNum(
                        voter_data.staking_token_balance,
                        stakingTokenMetadata?.decimals ?? 0,
                      )
                    : undefined;

                  return [voter_id, { isHumanVerified, stakingTokenBalance, votingPower }] as const;
                }),
              );

              return fromEntries(voterEntries);
            })
            .catch(() => undefined);

        if (voterRegistry !== undefined) {
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
            Record<AccountId, VotingRoundWinnerIntermediateData>
          >((acc, [candidateAccountId, candidateVotes]) => {
            // Calculate total weight for this candidate
            const accumulatedWeight = candidateVotes.reduce((sum, vote) => {
              const voterWeight = getVoteWeight(voterRegistry[vote.voter], mechanismConfig);
              return sum.plus(Big(vote.weight).mul(voterWeight));
            }, Big(0));

            // Store intermediate results with Big.js precision
            acc[candidateAccountId as AccountId] = {
              accountId: candidateAccountId,
              voteCount: candidateVotes.length,
              accumulatedWeight: accumulatedWeight,
            };

            return acc;
          }, {});

          // Calculate total accumulated weight across all winners
          const totalAccumulatedWeight = Object.values(intermediateResults).reduce(
            (sum, result) => sum.add(result.accumulatedWeight),
            Big(0),
          );

          // Second pass: Calculate estimated payouts using total accumulated weight
          const winnerRegistry = Object.entries(intermediateResults).reduce<
            VotingRoundParticipants["winnerRegistry"]
          >((acc, [candidateAccountId, result]) => {
            acc[candidateAccountId as AccountId] = {
              ...result,
              accumulatedWeight: result.accumulatedWeight.toNumber(),

              estimatedPayoutAmount: matchingPoolBalance
                .mul(
                  result.accumulatedWeight.div(
                    totalAccumulatedWeight.gt(0) ? totalAccumulatedWeight : 1,
                  ),
                )

                .toNumber(),
            };

            return acc;
          }, {});

          set((state) => ({
            resultsCache: {
              ...state.resultsCache,
              [electionId]: { totalVoteCount: votes.length, voterRegistry, winnerRegistry },
            },
          }));
        }
      },
    }),

    { name: "potlock-voting-round-results" },
  ),
);
