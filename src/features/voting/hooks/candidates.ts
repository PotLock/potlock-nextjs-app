import { useCallback, useMemo, useState } from "react";

import { ByElectionId, Candidate, votingClient, votingHooks } from "@/common/contracts/core/voting";
import { ByAccountId } from "@/common/types";
import { useToast } from "@/common/ui/hooks";
import { useSessionAuth } from "@/entities/session";

export interface VotingCandidateLookup extends ByElectionId {}

export const useVotingCandidateLookup = ({ electionId }: VotingCandidateLookup) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const userSession = useSessionAuth();
  const { data, ...candidatesQueryResult } = votingHooks.useElectionCandidates({ electionId });

  const { data: userVotes } = votingHooks.useVoterVotes({
    accountId: userSession.accountId,
    electionId,
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
  const userSession = useSessionAuth();
  // const { data: election } = votingHooks.useElection({ electionId });

  const {
    data: votes,
    mutate: revalidateVotes,
    isLoading: isVoteListLoading,
  } = votingHooks.useElectionCandidateVotes({
    electionId,
    accountId,
  });

  const isLoading = useMemo(
    () => votes === undefined && isVoteListLoading,
    [isVoteListLoading, votes],
  );

  const hasUserVotes = useMemo(
    () =>
      votes?.find(({ voter: voterAccountId }) => voterAccountId === userSession.accountId) !==
      undefined,

    [votes, userSession.accountId],
  );

  const canReceiveVotes = useMemo(
    () =>
      // election?.status === ElectionStatus.VotingPeriod &&
      votes === undefined ? false : !hasUserVotes,

    [hasUserVotes, votes],
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
