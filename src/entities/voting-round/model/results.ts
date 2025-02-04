import { Big } from "big.js";
import { entries, fromEntries, values } from "remeda";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type MpdaoVoterItem } from "@/common/api/indexer";
import type { NativeTokenMetadata } from "@/common/blockchains/near-protocol/hooks";
import { AccountId, type ElectionId, Vote } from "@/common/contracts/core/voting";
import { type FungibleTokenMetadata, ftContractClient } from "@/common/contracts/tokens/fungible";
import { bigNumToIndivisible, indivisibleUnitsToBigNum } from "@/common/lib";

import type { VoterProfile, VotingMechanismConfig, VotingRoundWinner } from "../types";
import type { VotingRoundParticipants } from "./types";
import { getVoteWeight, getVoteWeightAmplifiers } from "../utils/weight";

const VOTING_ROUND_RESULTS_SCHEMA_VERSION = 3;

export type VotingRoundWinnerIntermediateData = Pick<VotingRoundWinner, "accountId" | "votes"> & {
  accumulatedWeight: Big;
};

interface VotingRoundResultsState {
  cache: Record<
    ElectionId,
    VotingRoundParticipants & {
      totalVoteCount: number;
      payoutTokenMetadata: FungibleTokenMetadata | NativeTokenMetadata;
    }
  >;

  revalidate: (params: {
    electionId: number;
    mechanismConfig: VotingMechanismConfig;
    votes: Vote[];
    voterAccountIds: AccountId[];
    voterStatsSnapshot: MpdaoVoterItem[];
    matchingPoolBalance: Big;
    matchingPoolTokenMetadata: FungibleTokenMetadata | NativeTokenMetadata;
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
        matchingPoolTokenMetadata,
      }) => {
        const stakingTokenMetadata = mechanismConfig.stakingContractAccountId
          ? await ftContractClient.ft_metadata({
              tokenId: mechanismConfig.stakingContractAccountId,
            })
          : null;

        const payoutTokenMetadata = matchingPoolTokenMetadata;

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
          const { registry: winners } = values(candidates)
            .toSorted((a, b) => b.accumulatedWeight.sub(a.accumulatedWeight).toNumber())
            .reduce<{
              registry: VotingRoundParticipants["winners"];
              unallocatedPoolBalance: Big;
            }>(
              ({ registry, unallocatedPoolBalance }, candidate, entryIndex, collection) => {
                const isLastEntry = entryIndex === collection.length - 1;

                const estimatedPayoutShare = totalAccumulatedWeight.gt(0)
                  ? matchingPoolBalance.div(totalAccumulatedWeight).mul(candidate.accumulatedWeight)
                  : Big(0);

                const estimatedPayoutBig = isLastEntry
                  ? unallocatedPoolBalance
                  : estimatedPayoutShare;

                return {
                  unallocatedPoolBalance: unallocatedPoolBalance.minus(estimatedPayoutBig),

                  registry: {
                    ...registry,

                    [candidate.accountId]: {
                      ...candidate,
                      rank: entryIndex + 1,
                      accumulatedWeight: candidate.accumulatedWeight.toNumber(),

                      estimatedPayoutAmount: bigNumToIndivisible(
                        isLastEntry ? unallocatedPoolBalance : estimatedPayoutBig,
                        payoutTokenMetadata.decimals,
                      ),
                    },
                  },
                };
              },

              { registry: {}, unallocatedPoolBalance: matchingPoolBalance },
            );

          set((state) => ({
            cache: {
              ...state.cache,
              [electionId]: { totalVoteCount: votes.length, payoutTokenMetadata, voters, winners },
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
