import { type ChangeEvent, useCallback, useMemo, useState } from "react";

import { useRouter } from "next/router";

import { votingContractHooks } from "@/common/contracts/core/voting";
import { SearchBar } from "@/common/ui/layout/components";
import { VotingRoundVoteRow, useVotingRound, useVotingRoundResults } from "@/entities/voting-round";
import { PotLayout } from "@/layout/pot/components/layout";

export default function PotHistoryTab() {
  const { query: routeQuery } = useRouter();
  const { potId } = routeQuery as { potId: string };
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const onSearchTermChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => setSearchTerm(target.value),
    [],
  );

  const { data: votingRound } = useVotingRound({ potId });
  const { data: votingRoundResults } = useVotingRoundResults({ potId });

  const { isLoading: isListOfVotesLoading, data: votes } = votingContractHooks.useElectionVotes({
    enabled: votingRound !== undefined,
    electionId: votingRound?.electionId ?? 0,
  });

  const searchResults = useMemo(() => {
    const allEntries = votes?.toReversed() ?? [];

    return searchTerm === null
      ? allEntries
      : allEntries.filter(
          ({ candidate_id, voter }) =>
            voter.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate_id.toLowerCase().includes(searchTerm.toLowerCase()),
        );
  }, [searchTerm, votes]);

  // TODO: Place CSV download button here
  return votingRound === undefined ? (
    <div className="h-100 flex w-full flex-col items-center justify-center">
      <p className="prose text-2xl">{"No voting history."}</p>
    </div>
  ) : (
    <div className="flex w-full flex-col gap-6">
      <SearchBar placeholder="Search History" onChange={onSearchTermChange} />

      {searchResults.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center">
          <p className="prose text-2xl">{"No results found."}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 pb-8">
          {searchResults.map((entry) => (
            <VotingRoundVoteRow
              key={entry.candidate_id + entry.voter + entry.timestamp}
              data={entry}
              {...{ potId }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

PotHistoryTab.getLayout = function getLayout(page: React.ReactNode) {
  return <PotLayout>{page}</PotLayout>;
};
