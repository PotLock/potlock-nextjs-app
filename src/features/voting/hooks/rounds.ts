import { useMemo } from "react";

import { indexer } from "@/common/api/indexer";
import { votingHooks } from "@/common/contracts/core/voting";
import { yoctoNearToFloat } from "@/common/lib";
import { usePotActiveElections, usePotElections } from "@/entities/pot";

import { useRoundResultsStore } from "../model/round-results";
import type { VotingRound, VotingRoundKey } from "../types";

// TODO: Figure out a way to know exactly which ONE election to pick ( Pots V2 milestone )
export const useVotingRound = ({ potId }: VotingRoundKey): VotingRound | undefined => {
  const { elections } = usePotElections({ potId });

  return useMemo(() => {
    const election = elections?.at(0);

    return election ? { electionId: election.id, election } : undefined;
  }, [elections]);
};

// TODO: Figure out a way to know exactly which ONE election to pick ( Pots V2 milestone )
export const useActiveVotingRound = ({ potId }: VotingRoundKey): VotingRound | undefined => {
  const { activeElections } = usePotActiveElections({ potId });

  return useMemo(() => {
    const [_electionId, election] = activeElections?.at(0) ?? [];

    return election ? { electionId: election.id, election } : undefined;
  }, [activeElections]);
};

export const useVotingRoundResults = ({ potId }: VotingRoundKey) => {
  const { data: pot } = indexer.usePot({ potId });
  const votingRound = useVotingRound({ potId });

  const { data: votes } = votingHooks.useElectionVotes({
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
        // TODO: Reduce precision loss
        matchingPoolBalance: yoctoNearToFloat(pot.matching_pool_balance),
      });
    }
  }

  if (votingRound) {
    return store.resultsCache[votingRound.electionId];
  } else return undefined;
};
