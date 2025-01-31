import { useCallback, useMemo, useState } from "react";

import {
  ByElectionId,
  Candidate,
  votingContractClient,
  votingContractHooks,
} from "@/common/contracts/core/voting";
import { isAccountId } from "@/common/lib";
import { type AccountId, ByAccountId } from "@/common/types";
import { useToast } from "@/common/ui/hooks";
import { useWalletUserSession } from "@/common/wallet";

export interface VotingRoundCandidateLookup extends ByElectionId {}

export const useVotingRoundCandidateLookup = ({ electionId }: VotingRoundCandidateLookup) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const viewer = useWalletUserSession();

  const { data, ...candidatesQueryResult } = votingContractHooks.useElectionCandidates({
    enabled: electionId !== 0,
    electionId,
  });

  const { data: userVotes } = votingContractHooks.useVotingRoundVoterVotes({
    enabled: electionId !== 0 && isAccountId(viewer.accountId),
    electionId,
    accountId: viewer.accountId as AccountId,
  });

  return useMemo(() => {
    const searchResults = (data ?? []).filter((candidate) =>
      candidate.account_id.includes(searchTerm),
    );

    const dataByCategory = searchResults.reduce(
      (candidatesByCategory, candidate) => {
        const categoryKey =
          userVotes?.find(({ candidate_id }) => candidate_id === candidate.account_id) === undefined
            ? "votableCandidates"
            : "votedCandidates";

        return {
          ...candidatesByCategory,
          [categoryKey]: [...candidatesByCategory[categoryKey], candidate],
        };
      },

      {
        votedCandidates: [] as Candidate[],
        votableCandidates: [] as Candidate[],
      },
    );

    return {
      ...candidatesQueryResult,
      ...dataByCategory,
      candidates: searchResults,
      candidateSearchTerm: searchTerm,
      setCandidateSearchTerm: setSearchTerm,
    };
  }, [data, candidatesQueryResult, searchTerm, userVotes]);
};

export const useVotingRoundCandidateEntry = ({
  electionId,
  accountId,
}: ByElectionId & ByAccountId) => {
  const { toast } = useToast();
  const viewer = useWalletUserSession();

  const { data: isVotingPeriodOngoing = false } = votingContractHooks.useIsVotingPeriod({
    enabled: electionId !== 0,
    electionId,
  });

  const { data: remainingUserVotingCapacity, isLoading: isRemainingUserVotingCapacityLoading } =
    votingContractHooks.useVoterRemainingCapacity({
      enabled: electionId !== 0 && isAccountId(viewer.accountId),
      electionId,
      accountId: viewer.accountId as AccountId,
    });

  const {
    data: votes,
    mutate: revalidateVotes,
    isLoading: isVoteListLoading,
  } = votingContractHooks.useElectionCandidateVotes({
    enabled: electionId !== 0,
    electionId,
    accountId,
  });

  const isLoading = useMemo(
    () =>
      (votes === undefined && isVoteListLoading) ||
      (remainingUserVotingCapacity === undefined && isRemainingUserVotingCapacityLoading),

    [isRemainingUserVotingCapacityLoading, isVoteListLoading, remainingUserVotingCapacity, votes],
  );

  const hasUserVotes = useMemo(
    () =>
      votes?.find(({ voter: voterAccountId }) => voterAccountId === viewer.accountId) !== undefined,

    [votes, viewer.accountId],
  );

  const canReceiveVotes = useMemo(
    () =>
      electionId !== 0 &&
      viewer.isSignedIn &&
      (votes === undefined
        ? false
        : isVotingPeriodOngoing && !hasUserVotes && remainingUserVotingCapacity !== 0),

    [
      electionId,
      viewer.isSignedIn,
      votes,
      isVotingPeriodOngoing,
      hasUserVotes,
      remainingUserVotingCapacity,
    ],
  );

  const handleVoteCast = useCallback(
    () =>
      votingContractClient
        .vote({ election_id: electionId, vote: [accountId, 1] })
        .then((success) => {
          if (success) {
            revalidateVotes();

            toast({
              title: "Success!",
              description: "Your vote has been recorded successfully.",
            });
          }
        })
        .catch((error) => {
          console.error(error);

          toast({
            variant: "destructive",
            title: "Something went wrong.",
            description: "An error occurred while casting your vote.",
          });
        }),

    [accountId, electionId, revalidateVotes, toast],
  );

  return {
    votes,
    isLoading,
    canReceiveVotes,
    hasUserVotes,
    handleVoteCast,
  };
};
