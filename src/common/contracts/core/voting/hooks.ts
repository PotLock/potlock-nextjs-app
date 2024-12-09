import useSWR from "swr";

import { ByAccountId } from "@/common/types";

import { AccountId, ElectionId } from "./interfaces";
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

export const useElectionCandidateVotes = ({ electionId, accountId }: ByElectionId & ByAccountId) =>
  useSWR(
    [electionId, accountId],

    ([election_id, candidate_id]: [ElectionId, AccountId]) =>
      election_id === 0
        ? undefined
        : votingClient.get_candidate_votes({ election_id, candidate_id }),
  );
