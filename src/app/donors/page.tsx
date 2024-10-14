"use client";

import { useState } from "react";

import Image from "next/image";

import { Button, SearchBar, ToggleGroup } from "@/common/ui/components";

import { LeaderboardCard } from "../_components/LeaderboardCard";

interface Participant {
  rank: number;
  image: string;
  name: string;
  amount: number;
  amountUsd: number;
}

interface Activity {
  sender: string;
  senderImage: string;
  amount: number;
  amountUsd: number;
  currency: string;
  receiver: string;
  receiverImage: string;
  timestamp: number;
}

const topDonors: Participant[] = [
  {
    rank: 1,
    image: "/placeholder.svg?height=80&width=80",
    name: "nearcollective.near",
    amount: 731.25,
    amountUsd: 0,
  },
  {
    rank: 2,
    image: "/placeholder.svg?height=80&width=80",
    name: "nf-payments.near",
    amount: 731.25,
    amountUsd: 0,
  },
  {
    rank: 3,
    image: "/placeholder.svg?height=80&width=80",
    name: "creatives.potlock.near",
    amount: 731.25,
    amountUsd: 0,
  },
];

const otherDonors: Participant[] = [
  {
    rank: 4,
    image: "/placeholder.svg?height=40&width=40",
    name: "creativesportfolio.near",
    amount: 2000,
    amountUsd: 2000,
  },
  {
    rank: 5,
    image: "/placeholder.svg?height=40&width=40",
    name: "mike.near",
    amount: 2000,
    amountUsd: 2000,
  },
  {
    rank: 6,
    image: "/placeholder.svg?height=40&width=40",
    name: "mike.near",
    amount: 2000,
    amountUsd: 2000,
  },
];

const topSponsors: Participant[] = [
  {
    rank: 1,
    image: "/placeholder.svg?height=80&width=80",
    name: "sponsor1.near",
    amount: 1000,
    amountUsd: 1000,
  },
  {
    rank: 2,
    image: "/placeholder.svg?height=80&width=80",
    name: "sponsor2.near",
    amount: 900,
    amountUsd: 900,
  },
  {
    rank: 3,
    image: "/placeholder.svg?height=80&width=80",
    name: "sponsor3.near",
    amount: 800,
    amountUsd: 800,
  },
];

const ACTIVITY: Activity[] = [
  {
    sender: "nearcollective.near",
    senderImage: "/placeholder.svg?height=40&width=40",
    amount: 1000,
    amountUsd: 1000,
    currency: "NEAR",
    receiver: "creativesportfolio.near",
    receiverImage: "/placeholder.svg?height=40&width=40",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    sender: "nf-payments.near",
    senderImage: "/placeholder.svg?height=40&width=40",
    amount: 1000,
    amountUsd: 1000,
    currency: "NEAR",
    receiver: "mike.near",
    receiverImage: "/placeholder.svg?height=40&width=40",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    sender: "creatives.potlock.near",
    senderImage: "/placeholder.svg?height=40&width=40",
    amount: 1000,
    amountUsd: 1000,
    currency: "NEAR",
    receiver: "mike.near",
    receiverImage: "/placeholder.svg?height=40&width=40",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    sender: "nearcollective.near",
    senderImage: "/placeholder.svg?height=40&width=40",
    amount: 1000,
    amountUsd: 1000,
    currency: "NEAR",
    receiver: "creativesportfolio.near",
    receiverImage: "/placeholder.svg?height=40&width=40",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    sender: "nf-payments.near",
    senderImage: "/placeholder.svg?height=40&width=40",
    amount: 1000,
    amountUsd: 1000,
    currency: "NEAR",
    receiver: "mike.near",
    receiverImage: "/placeholder.svg?height=40&width=40",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
];

const timeAgo = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  if (diff < 1000 * 60) {
    return `${Math.floor(diff / 1000)}s ago`;
  } else if (diff < 1000 * 60 * 60) {
    return `${Math.floor(diff / (1000 * 60))}mns ago`;
  } else if (diff < 1000 * 60 * 60 * 24) {
    return `${Math.floor(diff / (1000 * 60 * 60))}hrs ago`;
  } else {
    return `${Math.floor(diff / (1000 * 60 * 60 * 24))}days ago`;
  }
};

export default function LeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("All time");
  const [selectedTab, setSelectedTab] = useState<
    "donors" | "sponsors" | "activities"
  >("activities"); // Updated formatting for selectedTab

  const toggleTab = (tab: "donors" | "sponsors") => {
    setSelectedTab(tab);
  };
  const renderLeaderboard = (
    participants: Participant[],
    type: "donor" | "sponsor",
  ) => (
    <>
      <div className="flex w-full flex-col gap-x-14 gap-y-4 py-10 sm:w-auto md:flex-row md:justify-between">
        <SearchBar
          className="w-85% max-w-xs flex-1 text-gray-400"
          placeholder={`Search projects`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex w-fit gap-1">
          {["All time", "1Y", "30D", "1W", "1D"].map((filter) => (
            <Button
              key={filter}
              variant={
                timeFilter === filter ? "sec-brand-filled" : "standard-outline"
              }
              onClick={() => setTimeFilter(filter)}
              className="py-0.375 px-3 text-sm"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>
      <div className="max-w-1000px min-w-lg mb-8 grid w-full grid-cols-3 gap-4 overflow-x-scroll">
        {participants.slice(0, 3).map((participant) => (
          <LeaderboardCard
            key={participant.rank}
            rank={participant.rank}
            image={participant.image}
            name={participant.name}
            amount={participant.amount}
            type={type}
          />
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200  bg-white">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Projects
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                AMT (USD)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {participants.slice(3).map((participant) => (
              <tr key={participant.rank}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900">
                      #{participant.rank}
                    </span>
                    {participant.rank === 4 ? (
                      <div className="ml-1 text-green-500" />
                    ) : (
                      <div className="ml-1 text-red-500" />
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={participant.image}
                      alt=""
                    />
                    <div className="ml-4">
                      <div className="text-sm font-bold text-gray-900">
                        {participant.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {participant.amount}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  ${participant.amountUsd}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const TABs = [
    {
      name: "activities",
      label: "All Activities",
      count: 20000,
    },
    {
      name: "donors",
      label: "Donor Leaderboard",
      count: 250,
    },
    {
      name: "sponsors",
      label: "Sponsor Leaderboard",
      count: 68,
    },
  ];

  return (
    <div className="container mx-auto flex flex-col py-8">
      <ToggleGroup defaultValue="donors" type="single" className="w-full">
        <div className="w-full overflow-x-scroll border-b border-gray-200">
          <div className="w-5xl grid grid-flow-col content-center items-center px-4">
            {TABs.map((tab) => (
              <div
                key={tab.name}
                className={`w-fit p-2 text-center text-lg font-semibold ${
                  selectedTab === tab.name
                    ? "text-brand-500 border-b-2 border-black"
                    : ""
                }`}
                onClick={() => toggleTab(tab.name as "donors" | "sponsors")}
              >
                <span className="inline">{tab.label}</span>
                <span className="ml-2 rounded-full bg-gray-200 px-2 py-1 text-sm text-gray-700">
                  {tab.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ToggleGroup>
      <div className="w-full flex-nowrap py-10">
        <div className="md:w-80% mx-auto w-full">
          {selectedTab === "activities" ? (
            <div className="w-full">
              <h1 className="font-lora text-3xl font-bold md:text-5xl">
                All Activities
              </h1>
              <div className="flex w-full flex-col justify-between gap-x-14 gap-y-4 py-10 sm:w-auto md:flex-row">
                <SearchBar
                  className="w-85% max-w-xs text-gray-400 md:w-auto"
                  placeholder={`Search projects`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex w-fit gap-1">
                  {["All time", "1Y", "30D", "1W", "1D"].map((filter) => (
                    <Button
                      key={filter}
                      variant={
                        timeFilter === filter
                          ? "sec-brand-filled"
                          : "standard-outline"
                      }
                      onClick={() => setTimeFilter(filter)}
                      className="py-0.375 px-3 text-sm"
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto bg-white">
                {ACTIVITY.map((activity, index) => (
                  <div
                    key={index}
                    className="border-gray-#ebebeb my-4 flex flex-wrap items-center justify-between rounded-xl border py-4"
                  >
                    <div className="w-224px flex items-center gap-2 overflow-x-scroll px-4 text-sm font-medium text-gray-900">
                      <Image
                        src={activity.senderImage}
                        className="h-10 w-10 rounded-full"
                        alt="sender image"
                        width={10}
                        height={10}
                      />
                      <h1>{activity.sender}</h1>
                    </div>
                    <div className="flex gap-2 px-4 align-middle text-sm text-gray-600">
                      Donated
                    </div>
                    <div className="w-140px flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {activity.amount} {activity.currency}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 text-sm text-gray-600">
                      to
                    </div>
                    <div className="w-224px flex items-center gap-2 overflow-x-scroll px-4 text-sm font-medium text-gray-900">
                      <Image
                        src={activity.receiverImage}
                        className="h-10 w-10 rounded-full"
                        alt="receiver image"
                        width={10}
                        height={10}
                      />
                      <h1>{activity.receiver}</h1>
                    </div>
                    <div className="w-120px flex items-center gap-2 whitespace-nowrap px-4 text-sm text-gray-600">
                      {timeAgo(activity.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            ""
          )}
          {selectedTab === "donors" ? (
            <div>
              <h1 className="mb-8 text-center font-lora text-3xl font-bold md:text-5xl">
                Donor Leaderboard
              </h1>
              {renderLeaderboard([...topDonors, ...otherDonors], "donor")}
            </div>
          ) : (
            ""
          )}
          {selectedTab === "sponsors" ? (
            <div>
              <h1 className="text-center font-lora text-3xl font-bold md:text-5xl">
                Sponsor Leaderboard
              </h1>
              {renderLeaderboard(topSponsors, "sponsor")}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
