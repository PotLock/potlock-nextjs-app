import useSWR from "swr";

import { ByAccountId } from "@/common/types";

import { AccountId, ElectionId } from "./interfaces";
import { votingClient } from "./singleton.client";

export interface ByElectionId {
  electionId: ElectionId;
}

export const useElections = () => useSWR(["get_elections"], () => votingClient.get_elections({}));

export const useActiveElections = () =>
  useSWR(["get_active_elections"], () => votingClient.get_active_elections());

export const useElection = ({ electionId }: ByElectionId) =>
  useSWR(
    ["get_election", electionId],

    ([_queryKey, election_id]: [string, ElectionId]) =>
      election_id === 0 ? undefined : votingClient.get_election({ election_id }),
  );

export const useElectionCandidates = ({ electionId }: ByElectionId) =>
  useSWR(
    ["get_election_candidates", electionId],

    ([_queryKey, election_id]: [string, ElectionId]) =>
      election_id === 0 ? undefined : votingClient.get_election_candidates({ election_id }),
  );

export const useElectionCandidateVotes = ({ electionId, accountId }: ByElectionId & ByAccountId) =>
  useSWR(
    ["get_candidate_votes", electionId, accountId],

    ([_queryKey, election_id, candidate_id]: [string, ElectionId, AccountId]) =>
      election_id === 0
        ? undefined
        : votingClient.get_candidate_votes({ election_id, candidate_id }),
  );

export const useElectionVotes = ({ electionId }: ByElectionId) =>
  useSWR(["get_election_votes", electionId], ([_queryKey, election_id]: [string, ElectionId]) =>
    election_id === 0 ? undefined : votingClient.get_election_votes({ election_id }),
  );
