import useSWR from "swr";

import type { ByPotId } from "@/common/api/indexer";
import { ByAccountId, type ConditionalExecution } from "@/common/types";

import { AccountId, ElectionId } from "./interfaces";
import { votingContractClient } from "./singleton.client";

export interface ByElectionId {
  electionId: ElectionId;
}

type BasicElectionQueryKey = ByElectionId & ConditionalExecution;

export const useElections = () =>
  useSWR(["get_elections"], () => votingContractClient.get_elections({}));

export const useActiveElections = () =>
  useSWR(["get_active_elections"], () => votingContractClient.get_active_elections());

export const useElection = ({ electionId, enabled = true }: BasicElectionQueryKey) =>
  useSWR(
    ["get_election", electionId],

    ([_queryKey, election_id]: [string, ElectionId]) =>
      !enabled ? undefined : votingContractClient.get_election({ election_id }),
  );

export const useIsVotingPeriod = ({ electionId, enabled = true }: BasicElectionQueryKey) =>
  useSWR(
    ["is_voting_period", electionId],

    ([_queryKey, election_id]: [string, ElectionId]) =>
      !enabled ? undefined : votingContractClient.is_voting_period({ election_id }),
  );

export const useElectionCandidates = ({ electionId, enabled = true }: BasicElectionQueryKey) =>
  useSWR(
    ["get_election_candidates", electionId],

    ([_queryKey, election_id]: [string, ElectionId]) =>
      !enabled ? undefined : votingContractClient.get_election_candidates({ election_id }),
  );

export const useElectionCandidateVotes = ({
  electionId,
  accountId,
  enabled = true,
}: BasicElectionQueryKey & ByAccountId) =>
  useSWR(
    ["get_candidate_votes", electionId, accountId],

    ([_queryKey, election_id, candidate_id]: [string, ElectionId, AccountId]) =>
      !enabled
        ? undefined
        : votingContractClient.get_candidate_votes({ election_id, candidate_id }),
  );

export const useElectionVotes = ({ electionId, enabled = true }: BasicElectionQueryKey) =>
  useSWR(["get_election_votes", electionId], ([_queryKey, election_id]: [string, ElectionId]) =>
    !enabled ? undefined : votingContractClient.get_election_votes({ election_id }),
  );

export const useElectionVoteCount = ({ electionId, enabled = true }: BasicElectionQueryKey) =>
  useSWR(
    ["get_election_vote_count", electionId],

    ([_queryKey, election_id]: [string, ElectionId]) =>
      !enabled ? undefined : votingContractClient.get_election_vote_count({ election_id }),
  );

export const useVotingRoundVoterVotes = ({
  electionId,
  accountId,
  enabled = true,
}: BasicElectionQueryKey & ByAccountId) =>
  useSWR(
    ["get_voter_votes", electionId, accountId],

    ([_queryKey, election_id, voter]: [string, ElectionId, AccountId]) =>
      !enabled ? undefined : votingContractClient.get_voter_votes({ election_id, voter }),
  );

export const useVoterRemainingCapacity = ({
  electionId,
  accountId,
  enabled = true,
}: BasicElectionQueryKey & ByAccountId) =>
  useSWR(
    ["get_voter_remaining_capacity", electionId, accountId],

    ([_queryKey, election_id, voter]: [string, ElectionId, AccountId]) =>
      !enabled
        ? undefined
        : votingContractClient.get_voter_remaining_capacity({ election_id, voter }),
  );

export const useUniqueVoters = ({ electionId, enabled = true }: BasicElectionQueryKey) =>
  useSWR(["get_unique_voters", electionId], ([_queryKey, election_id]: [string, ElectionId]) =>
    !enabled ? undefined : votingContractClient.get_unique_voters({ election_id }),
  );

export const usePotElections = ({ potId }: ByPotId) => {
  const { data: elections, isLoading } = useElections();

  return {
    isLoading,

    elections: elections?.filter(
      ({ election_type }) =>
        typeof election_type === "object" && "Pot" in election_type && election_type.Pot === potId,
    ),
  };
};

export const useActivePotElections = ({ potId }: ByPotId) => {
  const { data: activeElections } = useActiveElections();

  return {
    activeElections: activeElections?.filter(
      ([_electionId, { election_type }]) =>
        typeof election_type === "object" && "Pot" in election_type && election_type.Pot === potId,
    ),
  };
};
