import { ByPotId } from "@/common/api/indexer";
import { votingClientHooks } from "@/common/contracts/core/voting";

import { VOTING_ELECTION_ID_BY_POT_ID } from "../model/hardcoded";

export const useVotingElection = ({ potId }: ByPotId) => {
  const electionId = VOTING_ELECTION_ID_BY_POT_ID[potId] ?? 0;

  return votingClientHooks.useElection({ electionId });
};
