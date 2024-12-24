import { type ChangeEvent, useCallback, useMemo, useState } from "react";

import { useRouter } from "next/router";
import { MdOutlineGroup, MdOutlineHowToReg, MdOutlinePaid } from "react-icons/md";

import { SearchBar } from "@/common/ui/components";
import { VotingHistoryEntry } from "@/features/voting";
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

// Main component
export default function PotHistoryTab() {
  const { query: routeQuery } = useRouter();
  const { potId } = routeQuery as { potId: string };

  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const onSearchTermChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => setSearchTerm(target.value),
    [],
  );

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

  return (
    <div className="mx-auto w-full space-y-6 p-4">
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <SearchBar onChange={onSearchTermChange} />
        </div>
      </div>

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
