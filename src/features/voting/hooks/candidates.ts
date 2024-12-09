import { useMemo, useState } from "react";

import { ByPotId } from "@/common/api/indexer";
import { Candidate, votingClientHooks } from "@/common/contracts/core/voting";

import { VOTING_ELECTION_ID_BY_POT_ID } from "../model/hardcoded";

export const useVotingCandidates = ({ potId }: ByPotId) => {
  const electionId = VOTING_ELECTION_ID_BY_POT_ID[potId] ?? 0;

  const { data, ...candidatesQueryResult } = votingClientHooks.useElectionCandidates({
    electionId,
  });

  const [searchQuery, setSearchQuery] = useState<string>("");

  return useMemo(() => {
    const dataByCategory = (data ?? [])
      .filter((candidate) => candidate.account_id.includes(searchQuery))
      .reduce(
        (candidatesByCategory, candidate) => {
          const categoryKey =
            candidate.votes_received > 0 ? "candidatesWithVotes" : "candidatesWithoutVotes";

          return {
            ...candidatesByCategory,
            [categoryKey]: [...candidatesByCategory[categoryKey], candidate],
          };
        },

        {
          candidatesWithVotes: [] as Candidate[],
          candidatesWithoutVotes: [] as Candidate[],
        },
      );

    return {
      ...candidatesQueryResult,
      ...dataByCategory,
      candidates: data,
      candidateSearchQuery: searchQuery,
      setCandidateSearchQuery: setSearchQuery,
    };
  }, [data, candidatesQueryResult, searchQuery]);
};
