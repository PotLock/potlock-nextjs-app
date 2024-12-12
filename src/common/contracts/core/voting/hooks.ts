import useSWR from "swr";

import { UNKNOWN_ACCOUNT_ID_PLACEHOLDER } from "@/common/constants";
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

export const useElectionVoteCount = ({ electionId }: ByElectionId) =>
  useSWR(
    ["get_election_vote_count", electionId],

    ([_queryKey, election_id]: [string, ElectionId]) =>
      election_id === 0 ? undefined : votingClient.get_election_vote_count({ election_id }),
  );

export const useVoterVotes = ({ electionId, accountId }: ByElectionId & Partial<ByAccountId>) =>
  useSWR(
    ["get_voter_votes", electionId, accountId ?? UNKNOWN_ACCOUNT_ID_PLACEHOLDER],

    ([_queryKey, election_id, voter]: [string, ElectionId, AccountId]) =>
      election_id === 0 || voter === UNKNOWN_ACCOUNT_ID_PLACEHOLDER
        ? undefined
        : votingClient.get_voter_votes({ election_id, voter }),
  );

export const useVoterRemainingCapacity = ({
  electionId,
  accountId,
}: ByElectionId & Partial<ByAccountId>) =>
  useSWR(
    ["get_voter_remaining_capacity", electionId, accountId ?? UNKNOWN_ACCOUNT_ID_PLACEHOLDER],

    ([_queryKey, election_id, voter]: [string, ElectionId, AccountId]) =>
      election_id === 0 || voter === UNKNOWN_ACCOUNT_ID_PLACEHOLDER
        ? undefined
        : votingClient.get_voter_remaining_capacity({ election_id, voter }),
  );
