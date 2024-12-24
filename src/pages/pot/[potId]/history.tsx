import { type ChangeEvent, useCallback, useMemo, useState } from "react";

import { useRouter } from "next/router";
import { MdOutlineGroup, MdOutlineHowToReg, MdOutlinePaid } from "react-icons/md";

import { votingHooks } from "@/common/contracts/core/voting";
import { SearchBar } from "@/common/ui/components";
import { VotingHistoryEntry } from "@/features/voting";
import { useVotingRound } from "@/features/voting/hooks/rounds";
import { PotLayout } from "@/layout/pot/components/PotLayout";

// Types
interface WeightBoostItem {
  icon: React.ReactNode;
  label: string;
  isCurrentStage?: boolean;
  percentage: number;
  verified?: boolean;
}

interface WeightBoostData {
  total: number;
  items: WeightBoostItem[];
}

interface HistoryEntryData {
  id: string;
  username: string;
  votedFor: string;
  timestamp: string;
  weightBoost: WeightBoostData;
}

// Dummy data
const dummyHistoryData: HistoryEntryData[] = [
  {
    id: "1",
    username: "kritikdao.near",
    votedFor: "creativedao.near",
    timestamp: "12:04 PM",
    weightBoost: {
      total: 100,
      items: [
        {
          label: "Human Verification",
          percentage: 10,
          verified: true,
          icon: <MdOutlineHowToReg className="h-[18.64px] w-[18.64px]" />,
        },
        {
          label: "Up to 10,000 votes in mpDAO",
          percentage: 25,
          verified: true,
          icon: <MdOutlineGroup className="h-[18.64px] w-[18.64px]" />,
        },
        {
          label: "Up to 25,000 votes in mpDAO",
          percentage: 25,
          verified: true,
          icon: <MdOutlineGroup className="h-[18.64px] w-[18.64px]" />,
        },
        {
          label: "Stake at least 2 stNEAR",
          percentage: 10,
          verified: true,
          icon: <MdOutlinePaid className="h-[18.64px] w-[18.64px]" />,
        },
        {
          label: "Stake at least 10 stNEAR",
          percentage: 30,
          verified: true,
          isCurrentStage: true,
          icon: <MdOutlinePaid className="h-[18.64px] w-[18.64px]" />,
        },
      ],
    },
  },
];

export default function PotHistoryTab() {
  const { query: routeQuery } = useRouter();
  const { potId } = routeQuery as { potId: string };
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const onSearchTermChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => setSearchTerm(target.value),
    [],
  );

  const votingRound = useVotingRound({ potId });

  const { data: votes } = votingHooks.useElectionVotes({
    enabled: votingRound !== undefined,
    electionId: votingRound?.electionId ?? 0,
  });

  const searchResults = useMemo(
    () =>
      searchTerm === null
        ? dummyHistoryData
        : dummyHistoryData.filter(
            (entry) =>
              entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
              entry.votedFor.toLowerCase().includes(searchTerm.toLowerCase()),
          ),

    [searchTerm],
  );

  return votingRound === undefined ? (
    <div className="h-100 flex w-full flex-col items-center justify-center">
      <p className="prose text-2xl">{"No voting history."}</p>
    </div>
  ) : (
    <div className="flex w-full flex-col gap-6 p-4 md:p-0">
      <SearchBar placeholder="Search History" onChange={onSearchTermChange} />

      <div className="flex flex-col gap-6 ">
        {searchResults.map((entry) => (
          <VotingHistoryEntry key={entry.id} {...entry} />
        ))}
      </div>
    </div>
  );
}

PotHistoryTab.getLayout = function getLayout(page: React.ReactNode) {
  return <PotLayout>{page}</PotLayout>;
};
