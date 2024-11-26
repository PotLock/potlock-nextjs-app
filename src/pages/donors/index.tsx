import { useMemo, useState } from "react";

import { Lora } from "next/font/google";
import Image from "next/image";

import { coingecko } from "@/common/api/coingecko";
import { Account } from "@/common/api/indexer";
import { useDonors } from "@/common/api/indexer/hooks";
import { NearIcon } from "@/common/assets/svgs";
import { daysAgo } from "@/common/lib";
import { FilterChip, SearchBar, ToggleGroup } from "@/common/ui/components";
import { AccountOption } from "@/modules/core";
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
  {
    rank: 4,
    image: "https://picsum.photos/200/200/?blur",
    name: "sponsor4.near",
    amount: 800,
    amountUsd: 800,
  },
  {
    rank: 5,
    image: "https://picsum.photos/200/200/?blur",
    name: "sponsor5.near",
    amount: 100,
    amountUsd: 200,
  },
  {
    rank: 6,
    image: "https://picsum.photos/200/200/?blur",
    name: "sponsor6.near",
    amount: 10,
    amountUsd: 10,
  },
  {
    rank: 7,
    image: "https://picsum.photos/200/200/?blur",
    name: "sponsor7.near",
    amount: 30,
    amountUsd: 800,
  },
  {
    rank: 8,
    image: "https://picsum.photos/200/200/?blur",
    name: "sponsor8.near",
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

// Define a type guard to check if an object is of type Account
function isAccount(obj: any): obj is Account {
  return "total_donations_out_usd" in obj;
}

export default function LeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchActivity, setSearchActivity] = useState("");
  const [timeFilter, setTimeFilter] = useState("All time");
  const [selectedTab, setSelectedTab] = useState<
    "donors" | "sponsors" | "activities"
  >("activities");
  const toggleTab = (tab: "donors" | "sponsors" | "activities") => {
    setSelectedTab(tab);
  };

  const { data: donors } = useDonors({});

  const sponsors: Participant[] = [];
  const { data: priceOfOneNear } = coingecko.useOneNearUsdPrice();
  const price = priceOfOneNear ?? 5.0;

  console.log({ donors, priceOfOneNear });

  const handleSearch = (participant: any) => {
    if (!participant) return false;

    const searchLower = searchTerm.toLowerCase();

    const idMatches = isAccount(participant)
      ? participant.id?.toLowerCase().includes(searchLower)
      : participant.name.includes(searchLower);

    const nameMatches = participant.near_social_profile_data?.name
      ?.toLowerCase()
      .includes(searchLower);

    return idMatches || nameMatches;
  };

  const renderLeaderboard = (
    participants: Participant[],
    type: "donor" | "sponsor",
  ) => {
    const data = type === "donor" ? [...(donors || [])] : [...participants];

    console.log("data now", data);

    return (
      <>
        <div className="md:flex-row mx-auto flex w-full flex-col flex-wrap justify-between gap-x-14 gap-y-4 pb-4 pt-10">
          <SearchBar
            className="md:w-40 text-gray-400"
            placeholder={`Search projects`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex w-fit gap-3">
            {["All time", "1Y", "30D", "1W", "1D"].map((filter) => (
              <FilterChip
                key={filter}
                variant={
                  timeFilter === filter ? "brand-filled" : "brand-outline"
                }
                onClick={() => setTimeFilter(filter)}
                className="text-sm"
              >
                {filter}
              </FilterChip>
            ))}
          </div>
        </div>
        <div className="pl-36px xl:overflow-x-unset h-300px md:w-full relative ml-[-36px]  w-full">
          <div className="gap-20px absolute mb-8 grid w-full grid-flow-col overflow-x-scroll">
            {data
              ?.sort((a, b) => {
                const aAmount = isAccount(a)
                  ? a.total_donations_out_usd
                  : a.amountUsd;
                const bAmount = isAccount(b)
                  ? b.total_donations_out_usd
                  : b.amountUsd;
                return bAmount - aAmount;
              })
              .slice(0, 3)
              .map((participant, index) => {
                const name = isAccount(participant)
                  ? (participant.near_social_profile_data?.name ??
                    (participant.id?.length <= 20
                      ? participant.id
                      : `${participant.id.substring(0, 16)}...${participant.id.substring(participant.id.length - 4)}`))
                  : participant.name;
                return (
                  <DonationLeaderboardEntry
                    key={index}
                    rank={isAccount(participant) ? index + 1 : participant.rank}
                    image={
                      isAccount(participant)
                        ? (participant.near_social_profile_data?.image?.ipfs_cid
                            ? `https://ipfs.io/ipfs/${participant.near_social_profile_data?.image.ipfs_cid}`
                            : participant.near_social_profile_data?.image?.nft
                              ? participant.near_social_profile_data?.image?.nft
                                  ?.media
                              : "https://picsum.photos/200/200/?blur") ||
                          "https://picsum.photos/200/200/?blur"
                        : participant.image
                    }
                    name={name}
                    amount={Number(
                      (isAccount(participant)
                        ? participant.total_donations_out_usd / price
                        : participant.amount
                      ).toFixed(2),
                    )}
                    type={type}
                  />
                );
              })}
          </div>
        </div>

        <div className="md:block hidden rounded-2xl border border-gray-200  bg-white">
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
              {data
                ?.sort((a, b) => {
                  const aAmount = isAccount(a) ? a.total_donations_out_usd : 0;
                  const bAmount = isAccount(b) ? b.total_donations_out_usd : 0;
                  return bAmount - aAmount;
                })
                .slice(3)
                .filter(handleSearch)
                .map((donor, index) => (
                  <tr key={index}>
                    <td className="w-10px whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          #{isAccount(donor) ? index + 1 : donor.rank}
                        </span>
                        {(isAccount(donor) ? index + 1 : donor.rank) === 4 ? (
                          <div className="ml-1 text-green-500" />
                        ) : (
                          <div className="ml-1 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="ml-[-20px] whitespace-nowrap p-4">
                      <AccountOption
                        title="user Account"
                        accountId={isAccount(donor) ? donor?.id : donor.name}
                        highlightOnHover={true}
                        isRounded={true}
                      />
                      {/* <div className="ml-4">
                        <div className="font-500 text-sm text-gray-900">
                          {participant.near_social_profile_data?.name ??
                            participant.id}
                        </div>
                      </div> */}
                    </td>
                    <td className="w-100px whitespace-nowrap p-4">
                      <div className="gap-8px flex items-center text-sm text-gray-900">
                        <NearIcon className="w-18px h-18px pb-[-4]" />
                        <span className="font-600 m-0 pt-[2px]">
                          {isAccount(donor)
                            ? (donor.total_donations_out_usd / price).toFixed(2)
                            : donor.amount}
                        </span>
                      </div>
                    </td>
                    <td className="fw-600 w-100px whitespace-nowrap p-4 text-right text-sm text-gray-950">
                      ${" "}
                      {isAccount(donor)
                        ? donor.total_donations_out_usd
                        : donor.amountUsd}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="p-16px md:hidden flex flex-col items-start gap-4">
          {data?.map((participant, index) => (
            <div
              key={index}
              className="flex items-center gap-2 self-stretch rounded-2xl border border-solid border-[color:var(--Neutral-100,#EBEBEB)] p-4"
            >
              <div className="whitespace-nowrap">
                <div className="h-40px w-40px flex items-center">
                  <Image
                    className="h-40px w-40px rounded-full"
                    src={
                      isAccount(participant)
                        ? participant?.near_social_profile_data?.image?.ipfs_cid
                          ? `https://ipfs.near.social/ipfs/${participant.near_social_profile_data?.image?.ipfs_cid}`
                          : participant.near_social_profile_data?.image?.url ||
                            ""
                        : participant.image
                    }
                    width={10}
                    height={10}
                    alt="profile picture"
                  />
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-between whitespace-nowrap">
                  <div className="ml-1">
                    <div className="font-500 text-sm text-gray-900">
                      {isAccount(participant)
                        ? (participant?.near_social_profile_data?.name ??
                          participant.id)
                        : participant.name}
                    </div>
                  </div>
                  <div className="whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="fw-50 text-sm text-gray-900">
                        #{index + 1}
                      </span>
                      {index === 4 ? (
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
                      {isAccount(participant)
                        ? participant.total_donations_out_usd / price
                        : participant.amount}
                    </span>
                  </div>
                  <div className="fw-600 w-fit whitespace-nowrap text-right text-sm text-gray-500">
                    ~${" "}
                    {isAccount(participant)
                      ? participant.total_donations_out_usd
                      : participant.amountUsd}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const TABs = [
    {
      name: "activities",
      label: "All Activities",
      count: 20000,
    },
    {
      name: "donors",
      label: "Donor Leaderboard",
      count: donors?.length || 0,
    },
    {
      name: "sponsors",
      label: "Sponsor Leaderboard",
      count: 68,
    },
  ];

  return (
    <div className="flex w-full flex-col">
      <ToggleGroup
        defaultValue="donors"
        type="single"
        className="mt-40px relative w-full"
      >
        <div className="mb-40px md:mb-64px md:overflow-x-auto absolute w-full overflow-x-scroll border-b border-t border-gray-200">
          <div className="ml-20px md:ml-30px pt-16px md:w-fit grid grid-flow-col content-center items-center gap-x-4 px-4">
            {TABs.map((tab) => (
              <div
                key={tab.name}
                className={`py-10px px-16px text-#7B7B7B w-fit cursor-pointer text-center text-lg font-semibold ${
                  selectedTab === tab.name ? "border-b-2 border-black" : null
                }`}
                onClick={() =>
                  toggleTab(tab.name as "donors" | "sponsors" | "activities")
                }
              >
                <span
                  className={`inline whitespace-nowrap text-sm ${
                    selectedTab === tab.name ? "font-500 text-black" : null
                  }`}
                >
                  {tab.label}
                </span>
                <span
                  className={`border-#DBDBDB px-6px py-4px rounded-16px ml-2 border bg-gray-200 text-sm text-gray-700 ${
                    selectedTab === tab.name ? "font-600 text-black" : null
                  }`}
                >
                  {tab.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ToggleGroup>
      <div className="max-w-912px mx-auto flex w-full flex-col py-8">
        <div className="md:py-16 md:px-0 mx-auto w-full flex-nowrap px-5 py-9">
          <div className="mx-auto w-full">
            {selectedTab === "activities" ? (
              <div className="w-full">
                <h1
                  className={`md:text-5xl md:leading-[40px] md:tracking-[-1.68px] font-lora text-3xl font-semibold tracking-[-1.12px] ${lora.variable}`}
                >
                  All Activities
                </h1>
                <>
                  <div className="md:flex-row mx-auto flex w-full flex-col flex-wrap justify-between gap-x-14 gap-y-4 pb-4 pt-10">
                    <SearchBar
                      className="md:w-40 text-gray-400"
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
                          className="text-sm"
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
                              className="w-100px md:w-fit md:overflow-visible truncate"
                              title={activity.sender}
                            >
                              {activity.sender}
                            </h1>
                          </div>
                          <div className="flex items-center">
                            <div className="flex gap-2 px-4 align-middle text-sm text-gray-600">
                              Donated
                            </div>
                            <div>
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
                              className="w-100px md:w-fit md:overflow-visible truncate"
                              title={activity.receiver}
                            >
                              {activity.receiver}
                            </h1>
                          </div>
                          <div className="flex items-center gap-2 whitespace-nowrap pl-3 text-sm text-gray-600">
                            <span className="h-4px w-4px rounded-full bg-gray-600"></span>{" "}
                            {daysAgo(activity.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              </div>
            ) : null}
            {selectedTab === "donors" ? (
              <div className="w-full">
                <h1
                  className={`md:text-5xl md:leading-[40px] md:tracking-[-1.68px] font-lora text-3xl font-semibold tracking-[-1.12px] ${lora.variable}`}
                >
                  Donor Leaderboard
                </h1>
                {renderLeaderboard([...topDonors, ...otherDonors], "donor")}
              </div>
            ) : null}
            {selectedTab === "sponsors" ? (
              <div className="w-full">
                <h1
                  className={`md:text-5xl md:leading-[40px] md:tracking-[-1.68px] font-lora text-3xl font-semibold tracking-[-1.12px] ${lora.variable}`}
                >
                  Sponsor Leaderboard
                </h1>
                {renderLeaderboard(topSponsors, "sponsor")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
