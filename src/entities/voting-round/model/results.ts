import { Big } from "big.js";
import { entries, fromEntries, values } from "remeda";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type MpdaoVoterItem } from "@/common/api/indexer";
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
  voters: Record<AccountId, VoterProfile>;
  winners: Record<AccountId, VotingRoundWinner>;
};

interface VotingRoundResultsState {
  cache: Record<ElectionId, VotingRoundParticipants & { totalVoteCount: number }>;

  revalidate: (params: {
    electionId: number;
    mechanismConfig: VotingMechanismConfig;
    votes: Vote[];
    voters: MpdaoVoterItem[];
    matchingPoolBalance: Big;
  }) => Promise<void>;
}

export const useVotingRoundResultsStore = create<VotingRoundResultsState>()(
  persist(
    (set) => ({
      cache: {},

      revalidate: async ({
        electionId,
        mechanismConfig,
        votes,
        voters: voterList,
        matchingPoolBalance,
      }) => {
        const stakingTokenMetadata = mechanismConfig.stakingContractAccountId
          ? await ftClient.ft_metadata({ tokenId: mechanismConfig.stakingContractAccountId })
          : null;

        const voters: VotingRoundParticipants["voters"] | undefined = fromEntries(
          await Promise.all(
            voterList.map(async ({ voter_id, voter_data }) => {
              const votingPower =
                voter_data.locking_positions?.reduce(
                  (sum: Big, { voting_power }: { voting_power: string }) =>
                    sum.add(Big(voting_power)),
                  Big(0),
                ) ?? Big(0);

              const isHumanVerified = await is_human({ account_id: voter_id }).catch(() => false);

              const stakingTokenBalance = voter_data.staking_token_balance
                ? stringifiedU128ToBigNum(
                    voter_data.staking_token_balance,
                    stakingTokenMetadata?.decimals ?? 0,
                  )
                : undefined;

              return [voter_id, { isHumanVerified, stakingTokenBalance, votingPower }] as const;
            }),
          ),
        );

        if (voters !== undefined) {
          const votesByCandidate = votes.reduce<Record<AccountId, Vote[]>>(
            (registry, vote) => ({
              ...registry,

              [vote.candidate_id]:
                registry[vote.candidate_id] === undefined
                  ? []
                  : registry[vote.candidate_id].concat([vote]),
            }),

            {},
          );

          // First pass: Calculate accumulated weights for each candidate with Big.js precision
          const intermediateWinners = entries(votesByCandidate).reduce<
            Record<AccountId, VotingRoundWinnerIntermediateData>
          >((registry, [accountId, candidateVotes]) => {
            registry[accountId] = {
              accountId,
              voteCount: candidateVotes.length,

              accumulatedWeight: candidateVotes.reduce((sum, vote) => {
                const voterWeight = getVoteWeight(voters[vote.voter], mechanismConfig);
                return sum.plus(Big(vote.weight).mul(voterWeight));
              }, Big(0)),
            };

            return registry;
          }, {});

          // Calculate total accumulated weight across all winners
          const totalAccumulatedWeight = values(intermediateWinners).reduce(
            (sum, winner) => sum.add(winner.accumulatedWeight),
            Big(0),
          );

          // Second pass: Calculate estimated payouts using total accumulated weight
          const winners = entries(intermediateWinners).reduce<VotingRoundParticipants["winners"]>(
            (registry, [accountId, result]) => {
              registry[accountId] = {
                ...result,
                accumulatedWeight: result.accumulatedWeight.toNumber(),

                estimatedPayoutAmount: totalAccumulatedWeight.gt(0)
                  ? matchingPoolBalance
                      .mul(result.accumulatedWeight.div(totalAccumulatedWeight))
                      .toNumber()
                  : 0,
              };

              return registry;
            },

            {},
          );

          set((state) => ({
            cache: {
              ...state.cache,
              [electionId]: { totalVoteCount: votes.length, voters, winners },
            },
          }));
        }
      },
    }),

    { name: "@potlock/next/entities/voting-round/results" },
  ),
);
