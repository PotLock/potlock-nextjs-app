import { useState } from "react";

import { SearchBar, SortSelect } from "@/common/ui/components";

import { CampaignCard } from "./CampaignCard";

export const CampaignsList = () => {
  const [search, setSearch] = useState("");

  const SORT_LIST_PROJECTS = [
    { label: "Most recent", value: "recent" },
    { label: "Least recent", value: "older" },
  ];

  return (
    <div className="mt-5">
      <div className="my-5 flex items-center gap-2">
        <h1 className="text-[18px] font-semibold">All Campaigns</h1>
        <p>3</p>
      </div>
      <div className="flex w-full items-center gap-4">
        <SearchBar
          placeholder="Search Campaigns"
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />
        <SortSelect options={SORT_LIST_PROJECTS} />
      </div>
      <div className="my-4">
        <CampaignCard />
      </div>
    </div>
  );
};
