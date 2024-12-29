import { indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_DECIMALS } from "@/common/constants";
import { votingContractHooks } from "@/common/contracts/core/voting";
import { stringifiedU128ToBigNum } from "@/common/lib";
import { usePotFeatureFlags } from "@/entities/pot";

import { useRoundResultsStore } from "../model/round-results";
import type { VotingRoundKey } from "../types";
import { useVotingRound } from "./rounds";

export const useVotingRoundResults = ({ potId }: VotingRoundKey) => {
  const { data: pot } = indexer.usePot({ potId });
  const { hasVoting } = usePotFeatureFlags({ potId });
  const votingRound = useVotingRound({ potId });

  const { data: votes } = votingContractHooks.useElectionVotes({
    enabled: votingRound !== undefined,
    electionId: votingRound?.electionId ?? 0,
  });

  const store = useRoundResultsStore();

  if (pot && votingRound && votes) {
    const cachedResults = store.resultsCache[votingRound.electionId];

    // Update results if votes have changed
    if (!cachedResults || cachedResults.totalVoteCount !== votes.length) {
      store.updateResults({
        electionId: votingRound.electionId,
        votes,

        matchingPoolBalance: stringifiedU128ToBigNum(
          pot.matching_pool_balance,
          NATIVE_TOKEN_DECIMALS,
        ),
      });
    }
  }

  if (votingRound) {
    return store.resultsCache[votingRound.electionId];
  } else return undefined;
};
