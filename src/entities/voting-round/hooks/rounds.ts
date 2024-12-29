import { useMemo } from "react";

import { votingContractHooks } from "@/common/contracts/core/voting";

import type { VotingRound, VotingRoundKey } from "../types";

// TODO: Figure out a way to know exactly which ONE election to pick ( Pots V2 milestone )
export const useVotingRound = ({ potId }: VotingRoundKey): VotingRound | undefined => {
  const { elections } = votingContractHooks.usePotElections({ potId });

  return useMemo(() => {
    const election = elections?.at(0);

    return election ? { electionId: election.id, election } : undefined;
  }, [elections]);
};

// TODO: Figure out a way to know exactly which ONE election to pick ( Pots V2 milestone )
export const useActiveVotingRound = ({ potId }: VotingRoundKey): VotingRound | undefined => {
  const { activeElections } = votingContractHooks.useActivePotElections({ potId });

  return useMemo(() => {
    const [_electionId, election] = activeElections?.at(0) ?? [];

    return election ? { electionId: election.id, election } : undefined;
  }, [activeElections]);
};
