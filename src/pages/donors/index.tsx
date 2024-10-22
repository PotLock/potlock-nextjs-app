"use client";

import { useState } from "react";

import { Lora } from "next/font/google";
import Image from "next/image";

import { NearIcon } from "@/common/assets/svgs";
import { FilterChip, SearchBar, ToggleGroup } from "@/common/ui/components";
import { DonationLeaderboardEntry } from "@/modules/donation";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
});

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
    image: "https://picsum.photos/200/200/?blur",
    name: "nearcollective.near",
    amount: 731.25,
    amountUsd: 0,
  },
  {
    rank: 2,
    image: "https://picsum.photos/200/200/?blur",
    name: "nf-payments.near",
    amount: 731.25,
    amountUsd: 0,
  },
  {
    rank: 3,
    image: "https://picsum.photos/200/200/?blur",
    name: "creatives.potlock.near",
    amount: 731.25,
    amountUsd: 0,
  },
];

const otherDonors: Participant[] = [
  {
    rank: 4,
    image: "https://picsum.photos/200/200/?blur",
    name: "creativesportfolio.near",
    amount: 2000,
    amountUsd: 2000,
  },
  {
    rank: 5,
    image: "https://picsum.photos/200/200/?blur",
    name: "mike.near",
    amount: 2000,
    amountUsd: 2000,
  },
  {
    rank: 6,
    image: "https://picsum.photos/200/200/?blur",
    name: "mike.near",
    amount: 2000,
    amountUsd: 2000,
  },
];

const topSponsors: Participant[] = [
  {
    rank: 1,
    image: "https://picsum.photos/200/200/?blur",
    name: "sponsor1.near",
    amount: 1000,
    amountUsd: 1000,
  },
  {
    rank: 2,
    image: "https://picsum.photos/200/200/?blur",
    name: "sponsor2.near",
    amount: 900,
    amountUsd: 900,
  },
  {
    rank: 3,
    image: "https://picsum.photos/200/200/?blur",
    name: "sponsor3.near",
    amount: 800,
    amountUsd: 800,
  },
];

const ACTIVITY: Activity[] = [
  {
    sender: "nearcollective.near",
    senderImage: "https://picsum.photos/200/200/?blur",
    amount: 1000,
    amountUsd: 1000,
    currency: "NEAR",
    receiver: "creativesportfolio.near",
    receiverImage: "https://picsum.photos/200/200/?blur",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    sender: "nf-payments.near",
    senderImage: "https://picsum.photos/200/200/?blur",
    amount: 1000,
    amountUsd: 1000,
    currency: "NEAR",
    receiver: "mike.near",
    receiverImage: "https://picsum.photos/200/200/?blur",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    sender: "creatives.potlock.near",
    senderImage: "https://picsum.photos/200/200/?blur",
    amount: 1000,
    amountUsd: 1000,
    currency: "NEAR",
    receiver: "mike.near",
    receiverImage: "https://picsum.photos/200/200/?blur",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    sender: "nearcollective.near",
    senderImage: "https://picsum.photos/200/200/?blur",
    amount: 1000,
    amountUsd: 1000,
    currency: "NEAR",
    receiver: "creativesportfolio.near",
    receiverImage: "https://picsum.photos/200/200/?blur",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    sender: "nf-payments.near",
    senderImage: "https://picsum.photos/200/200/?blur",
    amount: 1000,
    amountUsd: 1000,
    currency: "NEAR",
    receiver: "mike.near",
    receiverImage: "https://picsum.photos/200/200/?blur",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
];

const timeAgo = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  if (diff < 1000 * 60) {
    return `${Math.floor(diff / 1000)}s ago`;
  } else if (diff < 1000 * 60 * 2) {
    return `1 min ago`;
  } else if (diff < 1000 * 60 * 60) {
    return `${Math.floor(diff / (1000 * 60))} mins ago`;
  } else if (diff < 1000 * 60 * 60 * 2) {
    return `1 hr ago`;
  } else if (diff < 1000 * 60 * 60 * 24) {
    return `${Math.floor(diff / (1000 * 60 * 60))} hrs ago`;
  } else if (diff < 1000 * 60 * 60 * 24 * 2) {
    return `1 day ago`;
  } else if (diff < 1000 * 60 * 60 * 24 * 7) {
    return `${Math.floor(diff / (1000 * 60 * 60 * 24))} days ago`;
  } else if (diff < 1000 * 60 * 60 * 24 * 7 * 2) {
    return `1 wk ago`;
  } else if (diff < 1000 * 60 * 60 * 24 * 30) {
    return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 7))} wks ago`;
  } else if (diff < 1000 * 60 * 60 * 24 * 30 * 2) {
    return `1 mn ago`;
  } else if (diff < 1000 * 60 * 60 * 24 * 365) {
    return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 30))} mns ago`;
  } else if (diff < 1000 * 60 * 60 * 24 * 365 * 2) {
    return `1 yr ago`;
  } else {
    return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 365))} yrs ago`;
  }
};

export default function LeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("All time");
  const [selectedTab, setSelectedTab] = useState<
    "donors" | "sponsors" | "activities"
  >("activities"); // Updated formatting for selectedTab

  const toggleTab = (tab: "donors" | "sponsors" | "activities") => {
    setSelectedTab(tab);
  };
  const renderLeaderboard = (
    participants: Participant[],
    type: "donor" | "sponsor",
  ) => (
    <>
      <div className="pb-24px flex w-full flex-col flex-wrap justify-between gap-x-14 gap-y-4 pt-10 md:flex-row">
        <SearchBar
          className="w-320px text-gray-400"
          placeholder={`Search projects`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex w-fit gap-3">
          {["All time", "1Y", "30D", "1W", "1D"].map((filter) => (
            <FilterChip
              key={filter}
              variant={timeFilter === filter ? "brand-filled" : "brand-outline"}
              onClick={() => setTimeFilter(filter)}
              className="py-0.375 px-3 text-sm"
            >
              {filter}
            </FilterChip>
          ))}
        </div>
      </div>
      <div className="pl-36px xl:overflow-x-unset h-300px relative ml-[-36px]  w-full">
        <div className="gap-20px absolute mb-8 grid w-full grid-flow-col overflow-scroll">
          {participants.slice(0, 3).map((participant) => (
            <DonationLeaderboardEntry
              key={participant.rank}
              rank={participant.rank}
              image={participant.image}
              name={participant.name}
              amount={participant.amount}
              type={type}
            />
          ))}
        </div>
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-gray-200 bg-white  md:block">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Rank
              </th>
              <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Projects
              </th>
              <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Amount
              </th>
              <th className="w-150px p-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                AMT (USD)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {participants
              .filter((participant) =>
                participant.name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()),
              )
              .sort((a, b) => b.amount - a.amount)
              .slice(3)
              .map((participant) => (
                <tr key={participant.rank}>
                  <td className="w-10px whitespace-nowrap p-4">
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
                  <td className="whitespace-nowrap p-4">
                    <div className="flex items-center">
                      <Image
                        className="h-10 w-10 rounded-full"
                        src={participant.image}
                        width={10}
                        height={10}
                        alt=""
                      />
                      <div className="ml-4">
                        <div className="font-500 text-sm text-gray-900">
                          {participant.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="w-100px whitespace-nowrap p-4">
                    <div className="gap-8px flex items-center text-sm text-gray-900">
                      <NearIcon className="w-18px h-18px pb-[-4]" />
                      <span className="font-600 m-0 pt-[2px]">
                        {participant.amount}
                      </span>
                    </div>
                  </td>
                  <td className="fw-600 w-100px whitespace-nowrap p-4 text-right text-sm text-gray-950">
                    $ {participant.amountUsd}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="p-16px flex flex-col items-start gap-4 md:hidden">
        {participants.map((participant) => (
          <div
            key={participant.rank}
            className="flex items-center gap-2 self-stretch rounded-2xl border border-solid border-[color:var(--Neutral-100,#EBEBEB)] p-4"
          >
            <div className="whitespace-nowrap">
              <div className="h-40px w-40px flex items-center">
                <Image
                  className="h-40px w-40px rounded-full"
                  src={participant.image}
                  width={10}
                  height={10}
                  alt=""
                />
              </div>
            </div>
            <div className="w-full">
              <div className="flex justify-between whitespace-nowrap">
                <div className="ml-1">
                  <div className="font-500 text-sm text-gray-900">
                    {participant.name}
                  </div>
                </div>
                <div className="whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="fw-50 text-sm text-gray-900">
                      #{participant.rank}
                    </span>
                    {participant.rank === 4 ? (
                      <div className="ml-1 text-green-500" />
                    ) : (
                      <div className="ml-1 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
              <div className="gap-8px flex items-center">
                <div className="gap-8px flex items-center text-sm text-gray-900">
                  <NearIcon className="w-18px h-18px" />
                  <span className="font-600 m-0 pt-[2px]">
                    {participant.amount}
                  </span>
                </div>
                <div className="fw-600 w-fit whitespace-nowrap text-right text-sm text-gray-500">
                  ~$ {participant.amountUsd}
                </div>
              </div>
            </div>
          </div>
        ))}
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
    <div className="mx-auto flex flex-col py-8">
      <ToggleGroup
        defaultValue="donors"
        type="single"
        className="mt-40px relative w-full"
      >
        <div className="mb-40px md:mb-64px xl:w-1024px absolute w-screen overflow-x-scroll border-b border-t border-gray-200 md:overflow-x-auto">
          <div className="ml-20px md:ml-30px pt-16px grid grid-flow-col content-center items-center gap-x-4 px-4 md:w-fit">
            {TABs.map((tab) => (
              <div
                key={tab.name}
                className={`py-10px px-16px text-#7B7B7B w-fit cursor-pointer text-center text-lg font-semibold ${
                  selectedTab === tab.name ? "border-b-2 border-black" : ""
                }`}
                onClick={() =>
                  toggleTab(tab.name as "donors" | "sponsors" | "activities")
                }
              >
                <span
                  className={`inline whitespace-nowrap text-sm ${
                    selectedTab === tab.name ? "font-500 text-black" : ""
                  }`}
                >
                  {tab.label}
                </span>
                <span
                  className={`border-#DBDBDB px-6px py-4px rounded-16px ml-2 border bg-gray-200 text-sm text-gray-700 ${
                    selectedTab === tab.name ? "font-600 text-black" : ""
                  }`}
                >
                  {tab.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ToggleGroup>
      <div className="py-64px mx-auto w-full flex-nowrap">
        <div className="mx-auto w-full">
          {selectedTab === "activities" ? (
            <div className="w-full">
              <h1
                className={`font-lora text-3xl font-semibold tracking-[-1.12px] md:text-5xl md:leading-[40px] md:tracking-[-1.68px] ${lora.variable}`}
              >
                All Activities
              </h1>
              <>
                <div className="pb-24px flex w-full flex-col flex-wrap justify-between gap-x-14 gap-y-4 pt-10 md:flex-row">
                  <SearchBar
                    className="w-320px text-gray-400"
                    placeholder={`Search projects`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="flex w-fit gap-3">
                    {["All time", "1Y", "30D", "1W", "1D"].map((filter) => (
                      <FilterChip
                        key={filter}
                        variant={
                          timeFilter === filter
                            ? "brand-filled"
                            : "brand-outline"
                        }
                        onClick={() => setTimeFilter(filter)}
                        className="py-0.375 px-3 text-sm"
                      >
                        {filter}
                      </FilterChip>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto bg-white">
                  {ACTIVITY.map((activity, index) => (
                    <div
                      key={index}
                      className="border-gray-#ebebeb gap-8px my-4 flex flex-wrap items-center justify-between rounded-xl border p-4"
                    >
                      <div className="flex w-full items-center justify-between gap-2 text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <Image
                            src={activity.senderImage}
                            className="h-24px w-24px rounded-full"
                            alt="sender image"
                            width={10}
                            height={10}
                          />
                          <h1
                            className="w-100px truncate md:w-fit md:overflow-visible"
                            title={activity.sender}
                          >
                            {activity.sender}
                          </h1>
                        </div>
                        <div className="flex items-center">
                          <div className="flex gap-2 px-4 align-middle text-sm text-gray-600">
                            Donated
                          </div>
                          <div className="">
                            <div className="gap-8px flex items-center text-sm text-gray-900">
                              <NearIcon className="w-18px h-18px" />{" "}
                              <span className="font-600 m-0 pt-[2px]">
                                {activity.amount}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4 text-sm text-gray-600">to</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <Image
                            src={activity.receiverImage}
                            className="h-24px w-24px rounded-full"
                            alt="receiver image"
                            width={10}
                            height={10}
                          />
                          <h1
                            className="w-100px truncate md:w-fit md:overflow-visible"
                            title={activity.receiver}
                          >
                            {activity.receiver}
                          </h1>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap pl-3 text-sm text-gray-600">
                          <span className="h-4px w-4px rounded-full bg-gray-600"></span>{" "}
                          {timeAgo(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            </div>
          ) : (
            ""
          )}
          {selectedTab === "donors" ? (
            <div className="w-full">
              <h1
                className={`font-lora text-3xl font-semibold tracking-[-1.12px] md:text-5xl md:leading-[40px] md:tracking-[-1.68px] ${lora.variable}`}
              >
                Donor Leaderboard
              </h1>
              {renderLeaderboard([...topDonors, ...otherDonors], "donor")}
            </div>
          ) : (
            ""
          )}
          {selectedTab === "sponsors" ? (
            <div className="w-full">
              <h1
                className={`font-lora text-3xl font-semibold tracking-[-1.12px] md:text-5xl md:leading-[40px] md:tracking-[-1.68px] ${lora.variable}`}
              >
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
