"use client";

import { useEffect, useState } from "react";

import { Filter, Star, User } from "lucide-react";
import {
  MdGroup,
  MdHowToReg,
  MdHowToVote,
  MdOutlineGroup,
  MdOutlineHowToReg,
  MdOutlinePaid,
  MdOutlineTimer,
  MdPaid,
} from "react-icons/md";

import {
  Avatar,
  AvatarImage,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SearchBar,
} from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { AccountProfilePicture } from "@/entities/account";
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
    username: "@kritikdao.near",
    votedFor: "@creativedao",
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
  {
    id: "2",
    username: "@johndoe.near",
    votedFor: "@innovativedao",
    timestamp: "12:03 PM",
    weightBoost: {
      total: 35,
      items: [
        {
          label: "Human Verification",
          percentage: 10,
          verified: true,
          isCurrentStage: true,
          icon: <MdOutlineHowToReg className="h-[18.64px] w-[18.64px]" />,
        },
        {
          label: "Up to 10,000 votes in mpDAO",
          percentage: 25,
          verified: false,
          icon: <MdOutlineGroup className="h-[18.64px] w-[18.64px]" />,
        },
        {
          label: "Up to 25,000 votes in mpDAO",
          percentage: 25,
          verified: false,
          icon: <MdOutlineGroup className="h-[18.64px] w-[18.64px]" />,
        },
        {
          label: "Stake at least 2 stNEAR",
          percentage: 10,
          verified: false,
          icon: <MdOutlinePaid className="h-[18.64px] w-[18.64px]" />,
        },
        {
          label: "Stake at least 10 stNEAR",
          percentage: 30,
          verified: false,
          icon: <MdOutlinePaid className="h-[18.64px] w-[18.64px]" />,
        },
      ],
    },
  },
  {
    id: "3",
    username: "@alice.near",
    votedFor: "@techdao",
    timestamp: "12:02 PM",
    weightBoost: {
      total: 70,
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
          isCurrentStage: true,
          icon: <MdOutlinePaid className="h-[18.64px] w-[18.64px]" />,
        },
        {
          label: "Stake at least 10 stNEAR",
          percentage: 30,
          verified: false,
          icon: <MdOutlinePaid className="h-[18.64px] w-[18.64px]" />,
        },
      ],
    },
  },
  {
    id: "4",
    username: "@bob.near",
    votedFor: "@artdao",
    timestamp: "12:01 PM",
    weightBoost: {
      total: 45,
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
          verified: false,
          icon: <MdOutlineGroup className="h-[18.64px] w-[18.64px]" />,
        },
        {
          label: "Stake at least 2 stNEAR",
          percentage: 10,
          verified: true,
          isCurrentStage: true,
          icon: <MdOutlinePaid className="h-[18.64px] w-[18.64px]" />,
        },
        {
          label: "Stake at least 10 stNEAR",
          percentage: 30,
          verified: false,
          icon: <MdOutlinePaid className="h-[18.64px] w-[18.64px]" />,
        },
      ],
    },
  },
];

// Components
const WeightBoostBadge = ({ data }: { data: WeightBoostItem }) => (
  <div
    className={cn(
      "inline-flex items-center gap-2 rounded-md border px-2 py-1 shadow-inner",
      data.verified
        ? "border-[#f8d3b0] bg-[#fef6ee] text-[#b63d18]"
        : "border-[#dadada] bg-[#f7f7f7] text-[#7b7b7b]",
    )}
  >
    {data.icon}
    <div>
      {data.verified && data.isCurrentStage && (
        <span className="pr-1 text-sm font-normal text-inherit">{data.label}</span>
      )}
      <span className="text-sm font-normal text-inherit">x{data.percentage}%</span>
    </div>
  </div>
);

function WeightBoost({ data }: { data: WeightBoostData }) {
  return (
    <div className="inline-flex flex-col flex-wrap items-start justify-start gap-3 md:flex-row md:items-center">
      {data.items.map((item, index) => (
        <WeightBoostBadge key={index} data={item} />
      ))}
    </div>
  );
}

function HistoryEntry({ username, votedFor, timestamp, weightBoost }: HistoryEntryData) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-[#eaeaea] bg-white p-5 shadow shadow-inner">
      <div className="flex items-center">
        <Avatar className="mr-4 flex h-12 w-12 items-center justify-center bg-orange-100 p-3">
          <MdHowToVote className="h-6 w-6 text-orange-500" />
        </Avatar>
        <div className="flex flex-col">
          <span className="text-[17px] font-semibold text-[#292929]">{username}</span>
          <div className="flex items-center gap-1">
            <span className="text-[17px] font-normal text-[#292929]">Voted</span>
            <AccountProfilePicture accountId={username} className="h-6 w-6" />
            <span className="text-[17px] font-semibold text-[#292929]">{votedFor}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <WeightBoost data={weightBoost} />
      </div>
      <div className="inline-flex">
        <MdOutlineTimer className="h-6 w-6 px-[3px] text-[#7a7a7a]" />
        <span className="text-center text-[17px] font-normal text-[#7a7a7a]">{timestamp}</span>
      </div>
    </div>
  );
}

// Main component
export default function PotHistoryTab() {
  const [historyData, setHistoryData] = useState<HistoryEntryData[]>(dummyHistoryData);

  const handleSearch = (value: string) => {
    const filteredData = dummyHistoryData.filter(
      (entry) =>
        entry.username.toLowerCase().includes(value.toLowerCase()) ||
        entry.votedFor.toLowerCase().includes(value.toLowerCase()),
    );

    setHistoryData(filteredData);
  };

  return (
    <div className="mx-auto w-full space-y-6 p-4">
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <SearchBar onChange={(e) => handleSearch(e.target.value)} />
        </div>
        <Button variant="brand-outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="flex flex-col gap-6 ">
        {historyData.map((entry) => (
          <HistoryEntry key={entry.id} {...entry} />
        ))}
      </div>
    </div>
  );
}

PotHistoryTab.getLayout = function getLayout(page: React.ReactNode) {
  return <PotLayout>{page}</PotLayout>;
};
