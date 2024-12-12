import { useMemo, useState } from "react";

import { ByElectionId, Candidate, votingHooks } from "@/common/contracts/core/voting";
import { useSessionAuth } from "@/entities/session";

export const useVotingCandidateLookup = ({ electionId }: ByElectionId) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const userSession = useSessionAuth();

  const { data, ...candidatesQueryResult } = votingHooks.useElectionCandidates({
    electionId,
  });

  const { data: userVotes } = votingHooks.useVoterVotes({
    accountId: userSession.accountId,
    electionId,
  });

  console.log("userVotes", userVotes);

  return useMemo(() => {
    const searchResults = (data ?? []).filter((candidate) =>
      candidate.account_id.includes(searchTerm),
    );

    const dataByCategory = searchResults.reduce(
      (candidatesByCategory, candidate) => {
        const categoryKey =
          candidate.votes_received > 0
            ? "candidatesWithUserVotes"
            : "candidatesAvailableForUserVoting";

        return {
          ...candidatesByCategory,
          [categoryKey]: [...candidatesByCategory[categoryKey], candidate],
        };
      },

      {
        candidatesWithUserVotes: [] as Candidate[],
        candidatesAvailableForUserVoting: [] as Candidate[],
      },
    );

    return {
      ...candidatesQueryResult,
      ...dataByCategory,
      candidates: searchResults,
      candidateSearchTerm: searchTerm,
      setCandidateSearchTerm: setSearchTerm,
    };
  }, [data, candidatesQueryResult, searchTerm]);
};
