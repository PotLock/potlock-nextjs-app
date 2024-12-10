import { useMemo, useState } from "react";

import { ByElectionId, Candidate, votingClientHooks } from "@/common/contracts/core/voting";

export const useVotingCandidates = ({ electionId }: ByElectionId) => {
  const { data, ...candidatesQueryResult } = votingClientHooks.useElectionCandidates({
    electionId,
  });

  const [searchTerm, setSearchTerm] = useState<string>("");

  return useMemo(() => {
    const dataByCategory = (data ?? [])
      .filter((candidate) => candidate.account_id.includes(searchTerm))
      .reduce(
        (candidatesByCategory, candidate) => {
          const categoryKey =
            candidate.votes_received > 0 ? "candidatesWithVotes" : "candidatesWithoutVotes";

          return {
            ...candidatesByCategory,
            [categoryKey]: [...candidatesByCategory[categoryKey], candidate],
          };
        },

        { candidatesWithVotes: [] as Candidate[], candidatesWithoutVotes: [] as Candidate[] },
      );

    return {
      ...candidatesQueryResult,
      ...dataByCategory,
      candidates: data,
      candidateSearchTerm: searchTerm,
      setCandidateSearchTerm: setSearchTerm,
    };
  }, [data, candidatesQueryResult, searchTerm]);
};
