"use client";

import { useState } from "react";

import { Button, SearchBar, ToggleGroup } from "@/common/ui/components";

import { LeaderboardCard } from "../_components/LeaderboardCard";

interface Participant {
  rank: number;
  image: string;
  name: string;
  amount: number;
  amountUsd: number;
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
      <div className="flex w-full justify-between py-10 sm:w-auto">
        <SearchBar
          className="max-w-md text-gray-400"
          placeholder={`Search projects`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {["All time", "1Y", "30D", "1W", "1D"].map((filter) => (
            <Button
              key={filter}
              variant={
                timeFilter === filter ? "sec-brand-filled" : "standard-outline"
              }
              onClick={() => setTimeFilter(filter)}
              className="text-sm"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>
      <div className="mb-8 grid w-full grid-cols-3 gap-4 overflow-x-scroll">
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
        <div>
          {selectedTab === "activities" ? (
            <div>
              <h1 className="text-center font-lora text-3xl font-bold md:text-5xl">
                All Activities
              </h1>
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
