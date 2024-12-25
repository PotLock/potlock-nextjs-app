import { useCallback, useMemo, useState } from "react";

import { ByElectionId, Candidate, votingClient, votingHooks } from "@/common/contracts/core/voting";
import { authHooks } from "@/common/services/auth";
import { ByAccountId } from "@/common/types";
import { useToast } from "@/common/ui/hooks";

export interface VotingCandidateLookup extends ByElectionId {}

export const useVotingCandidateLookup = ({ electionId }: VotingCandidateLookup) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const userSession = authHooks.useUserSession();

  const { data, ...candidatesQueryResult } = votingHooks.useElectionCandidates({
    enabled: electionId !== 0,
    electionId,
  });

  const { data: userVotes } = votingHooks.useVoterVotes({
    enabled: electionId !== 0 && userSession.accountId !== undefined,
    electionId,
    accountId: userSession.accountId ?? "noop",
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

export const useVotingCandidateEntry = ({ electionId, accountId }: ByElectionId & ByAccountId) => {
  const { toast } = useToast();
  const userSession = authHooks.useUserSession();

  const { data: isVotingPeriodOngoing = false } = votingHooks.useIsVotingPeriod({
    enabled: electionId !== 0,
    electionId,
  });

  const { data: remainingUserVotingCapacity, isLoading: isRemainingUserVotingCapacityLoading } =
    votingHooks.useVoterRemainingCapacity({
      enabled: electionId !== 0 && userSession.accountId !== undefined,
      electionId,
      accountId: userSession.accountId ?? "noop",
    });

  const {
    data: votes,
    mutate: revalidateVotes,
    isLoading: isVoteListLoading,
  } = votingHooks.useElectionCandidateVotes({
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
      votes?.find(({ voter: voterAccountId }) => voterAccountId === userSession.accountId) !==
      undefined,

    [votes, userSession.accountId],
  );

  const canReceiveVotes = useMemo(
    () =>
      electionId !== 0 &&
      userSession.isSignedIn &&
      (votes === undefined
        ? false
        : isVotingPeriodOngoing && !hasUserVotes && remainingUserVotingCapacity !== 0),

    [
      electionId,
      userSession.isSignedIn,
      votes,
      isVotingPeriodOngoing,
      hasUserVotes,
      remainingUserVotingCapacity,
    ],
  );

  const handleVoteCast = useCallback(
    () =>
      votingClient
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
