import { useEffect, useState } from "react";

import { Campaign } from "@/common/contracts/core/campaigns";
import { SearchBar, SortSelect } from "@/common/ui/layout/components";

import { CampaignCard } from "./CampaignCard";

export const CampaignsList = ({ campaigns }: { campaigns: Campaign[] }) => {
  const [search, setSearch] = useState("");
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);

  const SORT_LIST_PROJECTS = [
    { label: "Most recent", value: "recent" },
    { label: "Least recent", value: "older" },
  ];

  const handleSort = (sortType: string) => {
    const projects = [...campaigns];

    switch (sortType) {
      case "recent":
        projects.sort((a, b) => new Date(b.start_ms).getTime() - new Date(a.start_ms).getTime());
        setFilteredCampaigns(projects);
        break;

      case "older":
        projects.sort((a, b) => new Date(a.start_ms).getTime() - new Date(b.start_ms).getTime());
        setFilteredCampaigns(projects);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const handleSearch = (campaigns: any) => {
      return campaigns.name.toLowerCase().includes(search);
    };

    const filtered = campaigns?.filter((campaigns) => handleSearch(campaigns));
    setFilteredCampaigns(filtered);
  }, [search, campaigns]);

  return (
    <div className="mt-5">
      <div className="my-5 flex items-center gap-2">
        <h1 className="text-[18px] font-semibold">All Campaigns</h1>
        <p>{campaigns?.length}</p>
      </div>
      <div className="flex w-full items-center gap-4">
        <SearchBar
          placeholder="Search Campaigns"
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />
        <SortSelect options={SORT_LIST_PROJECTS} onValueChange={handleSort} />
      </div>
      <div className="w-full">
        {filteredCampaigns.length ? (
          <div className="my-10 grid gap-2 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} data={campaign} />
            ))}
          </div>
        ) : (
          <div className="min-h-100 flex w-full flex-col items-center justify-center">
            <img src="/assets/icons/no-list.svg" alt="" className="mb-4 h-[200px] w-[200px]" />
            <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
              <p className="w-100 font-lora text-center italic">No Campaign found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
