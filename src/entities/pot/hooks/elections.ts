import { useMemo } from "react";

import { ByPotId } from "@/common/api/indexer";
import { votingHooks } from "@/common/contracts/core/voting";

import type { PotVotingRound } from "../types";

export const usePotElections = ({ potId }: ByPotId) => {
  const { data: elections, isLoading } = votingHooks.useElections();

  return {
    isLoading,

    elections: elections?.filter(
      ({ election_type }) =>
        typeof election_type === "object" && "Pot" in election_type && election_type.Pot === potId,
    ),
  };
};

export const usePotActiveElections = ({ potId }: ByPotId) => {
  const { data: activeElections } = votingHooks.useActiveElections();

  return {
    activeElections: activeElections?.filter(
      ([_electionId, { election_type }]) =>
        typeof election_type === "object" && "Pot" in election_type && election_type.Pot === potId,
    ),
  };
};

// TODO: Figure out a way to know exactly which ONE election to pick ( Pots V2 milestone )
export const usePotVotingRound = ({ potId }: ByPotId): PotVotingRound | undefined => {
  const { elections } = usePotElections({ potId });

  return useMemo(() => {
    const election = elections?.at(0);

    return election ? { electionId: election.id, election } : undefined;
  }, [elections]);
};

// TODO: Figure out a way to know exactly which ONE election to pick ( Pots V2 milestone )
export const usePotActiveVotingRound = ({ potId }: ByPotId): PotVotingRound | undefined => {
  const { activeElections } = usePotActiveElections({ potId });

  return useMemo(() => {
    const [_electionId, election] = activeElections?.at(0) ?? [];

    return election ? { electionId: election.id, election } : undefined;
  }, [activeElections]);
};
