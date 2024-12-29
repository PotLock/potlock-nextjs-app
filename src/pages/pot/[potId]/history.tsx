import { type ChangeEvent, useCallback, useMemo, useState } from "react";

import { useWindowSize } from "@uidotdev/usehooks";
import { useRouter } from "next/router";

import { votingHooks } from "@/common/contracts/core/voting";
import { ScrollArea, SearchBar } from "@/common/ui/components";
import { VotingRoundHistoryEntry } from "@/entities/voting-round";
import { useVotingRound } from "@/entities/voting-round/hooks/rounds";
import { PotLayout } from "@/layout/pot/components/PotLayout";

export default function PotHistoryTab() {
  const { query: routeQuery } = useRouter();
  const { potId } = routeQuery as { potId: string };
  const { height: windowHeight } = useWindowSize();
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const onSearchTermChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => setSearchTerm(target.value),
    [],
  );

  const votingRound = useVotingRound({ potId });

  const { isLoading: isListOfVotesLoading, data: votes } = votingHooks.useElectionVotes({
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

  return votingRound === undefined ? (
    <div className="h-100 flex w-full flex-col items-center justify-center">
      <p className="prose text-2xl">{"No voting history."}</p>
    </div>
  ) : (
    <div className="flex w-full flex-col gap-6">
      <SearchBar placeholder="Search History" onChange={onSearchTermChange} />

      {searchResults.length === 0 ? (
        <div className="h-100 flex w-full flex-col items-center justify-center">
          <p className="prose text-2xl">{"No results found."}</p>
        </div>
      ) : (
        <ScrollArea style={{ height: (windowHeight ?? 820) - 320 }}>
          <div className="flex flex-col gap-6 pb-8">
            {searchResults.map((entry) => (
              <VotingRoundHistoryEntry
                key={entry.candidate_id + entry.voter + entry.timestamp}
                data={entry}
                {...{ potId }}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

PotHistoryTab.getLayout = function getLayout(page: React.ReactNode) {
  return <PotLayout>{page}</PotLayout>;
};
