import useSWR from "swr";

import type { ByPotId } from "@/common/api/indexer";
import { IS_CLIENT } from "@/common/constants";
import { ByAccountId, type ConditionalActivation } from "@/common/types";

import { AccountId, ElectionId } from "./interfaces";
import { votingContractClient } from "./singleton.client";

export interface ByElectionId {
  electionId: ElectionId;
}

type BasicElectionQueryKey = ByElectionId & ConditionalActivation;

export const useElections = ({ enabled = true }: ConditionalActivation | undefined = {}) =>
  useSWR(enabled && IS_CLIENT ? ["get_elections"] : null, () =>
    votingContractClient.get_elections({}),
  );

export const useActiveElections = ({ enabled = true }: ConditionalActivation | undefined = {}) =>
  useSWR(enabled && IS_CLIENT ? ["get_active_elections"] : null, () =>
    votingContractClient.get_active_elections(),
  );

export const useElection = ({ enabled = true, electionId }: BasicElectionQueryKey) =>
  useSWR(
    enabled && IS_CLIENT ? ["get_election", electionId] : null,

    ([_queryKeyHead, election_id]: [string, ElectionId]) =>
      votingContractClient.get_election({ election_id }),
  );

export const useIsVotingPeriod = ({ enabled = true, electionId }: BasicElectionQueryKey) =>
  useSWR(
    enabled && IS_CLIENT ? ["is_voting_period", electionId] : null,

    ([_queryKeyHead, election_id]: [string, ElectionId]) =>
      votingContractClient.is_voting_period({ election_id }),
  );

export const useElectionCandidates = ({ enabled = true, electionId }: BasicElectionQueryKey) =>
  useSWR(
    enabled && IS_CLIENT ? ["get_election_candidates", electionId] : null,

    ([_queryKeyHead, election_id]: [string, ElectionId]) =>
      votingContractClient.get_election_candidates({ election_id }),
  );

export const useElectionCandidateVotes = ({
  enabled = true,
  electionId,
  accountId,
}: BasicElectionQueryKey & ByAccountId) =>
  useSWR(
    enabled && IS_CLIENT ? ["get_candidate_votes", electionId, accountId] : null,

    ([_queryKeyHead, election_id, candidate_id]: [string, ElectionId, AccountId]) =>
      votingContractClient.get_candidate_votes({ election_id, candidate_id }),
  );

export const useElectionVotes = ({ enabled = true, electionId }: BasicElectionQueryKey) =>
  useSWR(
    enabled && IS_CLIENT ? ["get_election_votes", electionId] : null,
    ([_queryKeyHead, election_id]: [string, ElectionId]) =>
      votingContractClient.get_election_votes({ election_id }),
  );

export const useElectionVoteCount = ({ enabled = true, electionId }: BasicElectionQueryKey) =>
  useSWR(
    enabled && IS_CLIENT ? ["get_election_vote_count", electionId] : null,

    ([_queryKeyHead, election_id]: [string, ElectionId]) =>
      votingContractClient.get_election_vote_count({ election_id }),
  );

export const useVotingRoundVoterVotes = ({
  enabled = true,
  electionId,
  accountId,
}: BasicElectionQueryKey & ByAccountId) =>
  useSWR(
    enabled && IS_CLIENT ? ["get_voter_votes", electionId, accountId] : null,

    ([_queryKeyHead, election_id, voter]: [string, ElectionId, AccountId]) =>
      votingContractClient.get_voter_votes({ election_id, voter }),
  );

export const useVoterRemainingCapacity = ({
  enabled = true,
  electionId,
  accountId,
}: BasicElectionQueryKey & ByAccountId) =>
  useSWR(
    enabled && IS_CLIENT ? ["get_voter_remaining_capacity", electionId, accountId] : null,

    ([_queryKeyHead, election_id, voter]: [string, ElectionId, AccountId]) =>
      votingContractClient.get_voter_remaining_capacity({ election_id, voter }),
  );

export const useUniqueVoters = ({ enabled = true, electionId }: BasicElectionQueryKey) =>
  useSWR(
    enabled && IS_CLIENT ? ["get_unique_voters", electionId] : null,
    ([_queryKeyHead, election_id]: [string, ElectionId]) =>
      votingContractClient.get_unique_voters({ election_id }),
  );

export const usePotElections = ({ enabled = true, potId }: ByPotId & ConditionalActivation) => {
  const { data: elections, ...queryResult } = useElections({ enabled });

  return {
    ...queryResult,

    data: elections?.filter(
      ({ election_type }) =>
        typeof election_type === "object" && "Pot" in election_type && election_type.Pot === potId,
    ),
  };
};

export const useActivePotElections = ({
  enabled = true,
  potId,
}: ByPotId & ConditionalActivation) => {
  const { data: activeElections, ...queryResult } = useActiveElections({ enabled });

  return {
    ...queryResult,

    data: activeElections?.filter(
      ([_electionId, { election_type }]) =>
        typeof election_type === "object" && "Pot" in election_type && election_type.Pot === potId,
    ),
  };
};
