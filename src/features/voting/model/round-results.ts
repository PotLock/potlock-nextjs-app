import { Big } from "big.js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { VOTING_MECHANISM_CONFIG_MPDAO } from "./hardcoded";
import { AccountId, Vote } from "../../../common/contracts/core/voting/interfaces";

interface RoundResultsState {
  // Cache structure: electionId -> candidate -> results
  resultsCache: Record<
    number,
    Record<
      AccountId,
      {
        accumulatedWeight: number;
        estimatedPayoutAmount: number;
        lastVoteCount: number;
      }
    >
  >;
  updateResults: (params: {
    electionId: number;
    votes: Vote[];
    matchingPoolBalance: number;
    voterProfiles?: Record<
      AccountId,
      {
        isHumanVerified: boolean;
        stakingTokenBalance?: Big;
        stakingTokenBalanceUsd?: Big;
        votingPower: Big;
      }
    >;
  }) => void;
}

const useRoundResultsStore = create<RoundResultsState>()(
  persist(
    (set) => ({
      resultsCache: {},
      updateResults: ({ electionId, votes, matchingPoolBalance, voterProfiles = {} }) => {
        const { initialWeight, basicWeight, voteWeightAmplificationRules } =
          VOTING_MECHANISM_CONFIG_MPDAO;

        // Helper function to calculate voter's weight based on their profile
        const calculateVoterWeight = (voterId: AccountId) => {
          const profile = voterProfiles[voterId] ?? {};
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
              lastVoteCount: number;
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
            lastVoteCount: candidateVotes.length,
          };

          return acc;
        }, {});

        set((state) => ({
          resultsCache: {
            ...state.resultsCache,
            [electionId]: candidateResults,
          },
        }));
      },
    }),
    {
      name: "potlock-round-results",
    },
  ),
);

/**
 * Hook to get computed round results for a specific election
 * @param electionId - ID of the election
 * @param matchingPoolBalance - Current matching pool balance
 * @param votes - Array of votes for the election
 * @returns Computed results including accumulated weights and estimated payouts
 */
/**
 * Hook to get computed round results for a specific election
 */
export const useRoundResults = ({
  electionId,
  matchingPoolBalance,
  votes,
  voterProfiles,
}: {
  electionId: number;
  matchingPoolBalance: number;
  votes?: Vote[];
  voterProfiles?: Record<
    AccountId,
    {
      isHumanVerified: boolean;
      stakingTokenBalance?: Big;
      stakingTokenBalanceUsd?: Big;
      votingPower: Big;
    }
  >;
}) => {
  const store = useRoundResultsStore();

  // Update results if votes have changed
  if (votes) {
    const cachedResults = store.resultsCache[electionId];

    const voteCountsByCandidate = votes.reduce<Record<AccountId, number>>((acc, vote) => {
      if (!acc[vote.candidate_id]) acc[vote.candidate_id] = 0;
      acc[vote.candidate_id]++;
      return acc;
    }, {});

    const needsUpdate = Object.entries(voteCountsByCandidate).some(([candidateId, voteCount]) => {
      const cached = cachedResults?.[candidateId];
      return !cached || cached.lastVoteCount !== voteCount;
    });

    if (needsUpdate) {
      store.updateResults({ electionId, votes, matchingPoolBalance, voterProfiles });
    }
  }

  return store.resultsCache[electionId];
};
