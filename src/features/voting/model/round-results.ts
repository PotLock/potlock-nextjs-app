import { Big } from "big.js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { indexerClient } from "@/common/api/indexer";
import { getIsHuman } from "@/common/contracts/core/sybil";
import { AccountId, type ElectionId, Vote } from "@/common/contracts/core/voting";

import { VOTING_MECHANISM_CONFIG_MPDAO } from "./hardcoded";

interface RoundResultsState {
  // Cache structure: electionId -> results
  resultsCache: Record<
    ElectionId,
    {
      totalVoteCount: number;
      candidates: Record<AccountId, { accumulatedWeight: number; estimatedPayoutAmount: number }>;
    }
  >;

  updateResults: (params: {
    electionId: number;
    votes: Vote[];
    matchingPoolBalance: number;
  }) => Promise<void>;
}

const useRoundResultsStore = create<RoundResultsState>()(
  persist(
    (set) => ({
      resultsCache: {},
      updateResults: async ({ electionId, votes, matchingPoolBalance }) => {
        // Get unique voters
        const uniqueVoters = [...new Set(votes.map((vote) => vote.voter))];

        // Fetch voter profiles
        const voterProfiles: Record<
          AccountId,
          {
            isHumanVerified: boolean;
            stakingTokenBalance: Big;
            votingPower: Big;
          }
        > = {};

        await Promise.all(
          uniqueVoters.map(async (voterId) => {
            try {
              // Fetch voter info using the generated client
              const { data: voterInfo } = await indexerClient.v1MpdaoVoterInfoRetrieve({
                voter_id: voterId,
              });

              // Calculate voting power from positions
              const votingPower = voterInfo.locking_positions.reduce(
                (sum: Big, { voting_power }: { voting_power: string }) =>
                  sum.add(Big(voting_power)),
                Big(0),
              );

              // Get human verification status from sybil contract
              const isHumanVerified = await getIsHuman({ account_id: voterId });

              voterProfiles[voterId] = {
                isHumanVerified,
                votingPower,
                stakingTokenBalance: Big(voterInfo.balance_in_contract || 0),
              };
            } catch (error) {
              console.error(`Failed to fetch voter info for ${voterId}:`, error);

              // Use default values if fetch fails
              voterProfiles[voterId] = {
                isHumanVerified: false,
                votingPower: Big(0),
                stakingTokenBalance: Big(0),
              };
            }
          }),
        );

        const { initialWeight, basicWeight, voteWeightAmplificationRules } =
          VOTING_MECHANISM_CONFIG_MPDAO;

        // Helper function to calculate voter's weight based on their profile
        const calculateVoterWeight = (voterId: AccountId) => {
          const profile = voterProfiles[voterId];
          if (!profile) return Big(1); // Default to 1 if no profile

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

          return weight.eq(0) ? Big(1) : weight; // Default to 1 if no weight calculated
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
          Record<
            AccountId,
            {
              accumulatedWeight: number;
              estimatedPayoutAmount: number;
            }
          >
        >((acc, [candidateId, candidateVotes]) => {
          // Calculate total weight for this candidate
          const accumulatedWeight = candidateVotes.reduce((sum, vote) => {
            const voterWeight = calculateVoterWeight(vote.voter);
            return sum.plus(Big(vote.weight).mul(voterWeight));
          }, Big(0));

          // Store results
          acc[candidateId] = {
            accumulatedWeight: accumulatedWeight.toNumber(),
            // Calculate estimated payout based on relative weight
            estimatedPayoutAmount:
              matchingPoolBalance * (accumulatedWeight.toNumber() / votes.length),
          };

          return acc;
        }, {});

        set((state) => ({
          resultsCache: {
            ...state.resultsCache,
            [electionId]: {
              totalVoteCount: votes.length,
              candidates: candidateResults,
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
    const totalVotes = votes.length;

    // Check if total vote count has changed
    if (!cachedResults || cachedResults.totalVoteCount !== totalVotes) {
      store.updateResults({ electionId, votes, matchingPoolBalance });
    }
  }

  return store.resultsCache[electionId]?.candidates;
};
