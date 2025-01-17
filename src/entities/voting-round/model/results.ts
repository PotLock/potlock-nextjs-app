import { Big } from "big.js";
import { entries, fromEntries, values } from "remeda";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type MpdaoVoterItem } from "@/common/api/indexer";
import { AccountId, type ElectionId, Vote } from "@/common/contracts/core/voting";
import { ftClient } from "@/common/contracts/tokens/ft";
import { indivisibleUnitsToBigNum } from "@/common/lib";

import type { VoterProfile, VotingMechanismConfig, VotingRoundWinner } from "../types";
import type { VotingRoundParticipants } from "./types";
import { getVoteWeight, getVoteWeightAmplifiers } from "../utils/weight";

const VOTING_ROUND_RESULTS_SCHEMA_VERSION = 2;

type VotingRoundWinnerIntermediateData = Pick<VotingRoundWinner, "accountId" | "votes"> & {
  accumulatedWeight: Big;
};

interface VotingRoundResultsState {
  cache: Record<ElectionId, VotingRoundParticipants & { totalVoteCount: number }>;

  revalidate: (params: {
    electionId: number;
    mechanismConfig: VotingMechanismConfig;
    votes: Vote[];
    voterAccountIds: AccountId[];
    voterStatsSnapshot: MpdaoVoterItem[];
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
        voterAccountIds,
        voterStatsSnapshot,
        matchingPoolBalance,
      }) => {
        const stakingTokenMetadata = mechanismConfig.stakingContractAccountId
          ? await ftClient.ft_metadata({ tokenId: mechanismConfig.stakingContractAccountId })
          : null;

        /**
         * Voter profiles with Big.js precision
         */
        const voterProfiles: Record<AccountId, VoterProfile> | undefined = fromEntries(
          voterAccountIds.map((voterAccountId) => {
            const voter = voterStatsSnapshot.find(({ voter_id }) => voter_id === voterAccountId);

            const votingPower =
              voter?.voter_data.locking_positions?.reduce(
                (sum: Big, { voting_power }: { voting_power: string }) =>
                  sum.add(Big(voting_power)),
                Big(0),
              ) ?? Big(0);

            const stakingTokenBalance = voter?.voter_data.staking_token_balance
              ? indivisibleUnitsToBigNum(
                  voter.voter_data.staking_token_balance,
                  stakingTokenMetadata?.decimals ?? 0,
                )
              : Big(0);

            return [
              voterAccountId,

              {
                accountId: voterAccountId,
                isHumanVerified: voter?.voter_data.is_human ?? false,
                stakingTokenBalance,
                votingPower,
              },
            ] as const;
          }),
        );

        if (voterProfiles !== undefined) {
          const votesByCandidate = votes.reduce<Record<AccountId, Vote[]>>(
            (registry, vote) => ({
              ...registry,
              [vote.candidate_id]: [...(registry[vote.candidate_id] ?? []), vote],
            }),

            {},
          );

          // Calculate accumulated weights for each candidate with Big.js precision
          const candidates = entries(votesByCandidate).reduce<
            Record<AccountId, VotingRoundWinnerIntermediateData>
          >(
            (registry, [accountId, candidateVotes]) => ({
              ...registry,

              [accountId]: {
                accountId,
                votes: candidateVotes,

                accumulatedWeight: candidateVotes.reduce((sum, vote) => {
                  const voterWeight = getVoteWeight(voterProfiles[vote.voter], mechanismConfig);
                  return sum.plus(Big(vote.weight).mul(voterWeight));
                }, Big(0)),
              },
            }),

            {},
          );

          // Calculate total accumulated weight across all winners
          const totalAccumulatedWeight = values(candidates).reduce(
            (sum, winner) => sum.add(winner.accumulatedWeight),
            Big(0),
          );

          const voters = entries(voterProfiles).reduce<VotingRoundParticipants["voters"]>(
            (registry, [accountId, voter]) => ({
              ...registry,

              [accountId]: {
                ...voter,
                votingPower: voter.votingPower.toNumber(),

                vote: {
                  amplifiers: getVoteWeightAmplifiers(voter, mechanismConfig),
                  weight: getVoteWeight(voter, mechanismConfig).toNumber(),
                },
              },
            }),

            {},
          );

          // Calculate estimated payouts using total accumulated weight
          const winners = entries(candidates).reduce<VotingRoundParticipants["winners"]>(
            (registry, [accountId, winner]) => ({
              ...registry,

              [accountId]: {
                ...winner,
                accumulatedWeight: winner.accumulatedWeight.toNumber(),

                estimatedPayoutAmount: totalAccumulatedWeight.gt(0)
                  ? matchingPoolBalance
                      .mul(winner.accumulatedWeight.div(totalAccumulatedWeight))
                      .toNumber()
                  : 0,
              },
            }),

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

    {
      name: `@potlock/voting-rounds/v${VOTING_ROUND_RESULTS_SCHEMA_VERSION}`,
    },
  ),
);
