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
  voterRegistry: Record<AccountId, VoterProfile>;
  winnerRegistry: Record<AccountId, VotingRoundWinner>;
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

export const useRoundResultsStore = create<VotingRoundResultsState>()(
  persist(
    (set) => ({
      cache: {},

      revalidate: async ({ electionId, mechanismConfig, votes, voters, matchingPoolBalance }) => {
        const stakingTokenMetadata = mechanismConfig.stakingContractAccountId
          ? await ftClient.ft_metadata({ tokenId: mechanismConfig.stakingContractAccountId })
          : null;

        const voterRegistry: VotingRoundParticipants["voterRegistry"] | undefined = fromEntries(
          await Promise.all(
            voters.map(async ({ voter_id, voter_data }) => {
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

        if (voterRegistry !== undefined) {
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

          // First pass: Calculate accumulated weights for each candidate
          const intermediateWinners = entries(votesByCandidate).reduce<
            Record<AccountId, VotingRoundWinnerIntermediateData>
          >((acc, [candidateAccountId, candidateVotes]) => {
            // Store intermediate results with Big.js precision
            acc[candidateAccountId as AccountId] = {
              accountId: candidateAccountId,
              voteCount: candidateVotes.length,

              accumulatedWeight: candidateVotes.reduce((sum, vote) => {
                const voterWeight = getVoteWeight(voterRegistry[vote.voter], mechanismConfig);
                return sum.plus(Big(vote.weight).mul(voterWeight));
              }, Big(0)),
            };

            return acc;
          }, {});

          // Calculate total accumulated weight across all winners
          const totalAccumulatedWeight = values(intermediateWinners).reduce(
            (sum, result) => sum.add(result.accumulatedWeight),
            Big(0),
          );

          // Second pass: Calculate estimated payouts using total accumulated weight
          const winnerRegistry = entries(intermediateWinners).reduce<
            VotingRoundParticipants["winnerRegistry"]
          >((acc, [candidateAccountId, result]) => {
            acc[candidateAccountId as AccountId] = {
              ...result,
              accumulatedWeight: result.accumulatedWeight.toNumber(),

              estimatedPayoutAmount: totalAccumulatedWeight.gt(0)
                ? matchingPoolBalance
                    .mul(result.accumulatedWeight.div(totalAccumulatedWeight))
                    .toNumber()
                : 0,
            };

            return acc;
          }, {});

          set((state) => ({
            cache: {
              ...state.cache,
              [electionId]: { totalVoteCount: votes.length, voterRegistry, winnerRegistry },
            },
          }));
        }
      },
    }),

    { name: "potlock-voting-round-results" },
  ),
);
