import useSWR from "swr";

import { ElectionId } from "./interfaces";
import { votingClient } from "./singleton.client";

export interface ByElectionId {
  electionId: ElectionId;
}

export const useElection = ({ electionId }: ByElectionId) =>
  useSWR(
    [electionId],

    ([election_id]: [ElectionId]) =>
      election_id === 0 ? undefined : votingClient.get_election({ election_id }),
  );

export const useElectionCandidates = ({ electionId }: ByElectionId) =>
  useSWR(
    [electionId],

    ([election_id]: [ElectionId]) =>
      election_id === 0 ? undefined : votingClient.get_election_candidates({ election_id }),
  );
