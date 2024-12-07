import { ByPotId } from "@/common/api/indexer";
import { votingClientHooks } from "@/common/contracts/core/voting";

import { VOTING_ELECTION_ID_BY_POT_ID } from "../model/hardcoded";

export const usePotBenefactorsElection = ({ potId }: ByPotId) => {
  const electionId = VOTING_ELECTION_ID_BY_POT_ID[potId] ?? 0;

  return votingClientHooks.useElection({ electionId });
};

export const usePotBenefactorCandidates = ({ potId }: ByPotId) => {
  const electionId = VOTING_ELECTION_ID_BY_POT_ID[potId] ?? 0;

  return votingClientHooks.useElectionCandidates({ electionId });
};
