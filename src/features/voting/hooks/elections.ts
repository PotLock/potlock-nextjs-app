import { ByPotId } from "@/common/api/indexer";
import { votingClientHooks } from "@/common/contracts/core/voting";

import { VOTING_ELECTION_ID_BY_POT_ID } from "../model/hardcoded";

export const usePotElections = ({ potId }: ByPotId) => {
  const { data: elections } = votingClientHooks.useElections();

  console.log(elections);

  return void "unimplemented!";
};

export const usePotActiveElections = ({ potId }: ByPotId) => {
  const { data: activeElections } = votingClientHooks.useActiveElections();

  console.log(activeElections);

  return void "unimplemented!";
};

export const useVotingElection = ({ potId }: ByPotId) => {
  const electionId = VOTING_ELECTION_ID_BY_POT_ID[potId] ?? 0;

  const _ = usePotElections({ potId });

  return votingClientHooks.useElection({ electionId });
};
