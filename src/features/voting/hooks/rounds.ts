import { useMemo } from "react";

import { usePotActiveElections, usePotElections } from "@/entities/pot";

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
