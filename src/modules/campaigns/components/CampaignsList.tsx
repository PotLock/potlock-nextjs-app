import { useEffect, useState } from "react";

import { Campaign } from "@/common/contracts/potlock";
import { SearchBar, SortSelect } from "@/common/ui/components";

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
        projects.sort(
          (a, b) =>
            new Date(b.start_ms as string).getTime() -
            new Date(a.start_ms as string).getTime(),
        );
        setFilteredCampaigns(projects);
        break;
      case "older":
        projects.sort(
          (a, b) =>
            new Date(a.start_ms as string).getTime() -
            new Date(b.start_ms as string).getTime(),
        );
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
      <div className="my-4 flex flex-wrap gap-8">
        {filteredCampaigns.map((campaign) => (
          <CampaignCard key={campaign.id} data={campaign} />
        ))}
      </div>
    </div>
  );
};
