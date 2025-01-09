import { Big } from "big.js";
import { entries, fromEntries, values } from "remeda";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type MpdaoVoterItem } from "@/common/api/indexer";
import { is_human } from "@/common/contracts/core/sybil";
import { AccountId, type ElectionId, Vote } from "@/common/contracts/core/voting";
import { ftClient } from "@/common/contracts/tokens/ft";
import { stringifiedU128ToBigNum } from "@/common/lib";

import type {
  VoterProfile,
  VotingMechanismConfig,
  VotingRoundVoterSummary,
  VotingRoundWinner,
} from "../types";
import { getVoteWeight, getVoteWeightAmplifiers } from "../utils/weight";

const VOTING_ROUND_RESULTS_SCHEMA_VERSION = 1;

type VotingRoundWinnerIntermediateData = Pick<VotingRoundWinner, "accountId" | "votes"> & {
  accumulatedWeight: Big;
};

type VotingRoundParticipants = {
  voters: Record<AccountId, VotingRoundVoterSummary>;
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

        /**
         * Voter profiles with Big.js precision
         */
        const voterProfiles: Record<AccountId, VoterProfile> | undefined = fromEntries(
          await Promise.all(
            voterList.map(async ({ voter_id: accountId, voter_data }) => {
              const votingPower =
                voter_data.locking_positions?.reduce(
                  (sum: Big, { voting_power }: { voting_power: string }) =>
                    sum.add(Big(voting_power)),
                  Big(0),
                ) ?? Big(0);

              const isHumanVerified = await is_human({ account_id: accountId }).catch(() => false);

              const stakingTokenBalance = voter_data.staking_token_balance
                ? stringifiedU128ToBigNum(
                    voter_data.staking_token_balance,
                    stakingTokenMetadata?.decimals ?? 0,
                  )
                : undefined;

              return [
                accountId,
                { accountId, isHumanVerified, stakingTokenBalance, votingPower },
              ] as const;
            }),
          ),
        );

        if (voterProfiles !== undefined) {
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

          // Calculate accumulated weights for each candidate with Big.js precision
          const candidates = entries(votesByCandidate).reduce<
            Record<AccountId, VotingRoundWinnerIntermediateData>
          >((registry, [accountId, candidateVotes]) => {
            registry[accountId] = {
              accountId,
              votes: candidateVotes,

              accumulatedWeight: candidateVotes.reduce((sum, vote) => {
                const voterWeight = getVoteWeight(voterProfiles[vote.voter], mechanismConfig);
                return sum.plus(Big(vote.weight).mul(voterWeight));
              }, Big(0)),
            };

            return registry;
          }, {});

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
      name: `@potlock/next/entities/voting-round/results/v${VOTING_ROUND_RESULTS_SCHEMA_VERSION}`,
    },
  ),
);
