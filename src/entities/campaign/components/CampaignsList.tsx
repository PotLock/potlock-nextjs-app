import { useEffect, useMemo, useState } from "react";

import { Campaign } from "@/common/api/indexer";
import { SearchBar, SortSelect, Spinner } from "@/common/ui/layout/components";

import { CampaignCard } from "./CampaignCard";
import { useAllCampaignLists } from "../hooks/useCampaigns";

export const CampaignsList = () => {
  const [search, setSearch] = useState("");
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);

  const { buttons, campaigns, loading, currentTab } = useAllCampaignLists();

  const SORT_LIST_PROJECTS = [
    { label: "Newest", value: "recent" },
    { label: "Oldest", value: "older" },
  ];

  const handleSort = (sortType: string) => {
    const projects = [...campaigns];

    switch (sortType) {
      case "recent":
        projects.sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime());
        setFilteredCampaigns(projects);
        break;

      case "older":
        projects.sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
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

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="flex h-40 items-center justify-center">
          <Spinner className="h-7 w-7" />
        </div>
      );
    }

    if (!filteredCampaigns || filteredCampaigns.length === 0) {
      return (
        <div className="min-h-100 flex w-full flex-col items-center justify-center">
          <img src="/assets/icons/no-list.svg" alt="" className="mb-4 h-[200px] w-[200px]" />
          <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
            <p className="w-100 font-lora text-center italic">No Campaign found</p>
          </div>
        </div>
      );
    }

    return (
      <div className="my-10 grid gap-2 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {filteredCampaigns
          .filter((campaign) => campaign?.on_chain_id !== 14)
          .map((campaign) => (
            <CampaignCard key={campaign.on_chain_id} data={campaign} />
          ))}
      </div>
    );
  }, [loading, filteredCampaigns]);

  return (
    <div className="mt-5">
      <div className="my flex items-center gap-3 md:gap-1">
        {buttons.map(
          ({ label, onClick, type, condition = true }) =>
            condition && (
              <button
                key={type}
                className={`border px-3 py-1 transition-all duration-200 ease-in-out ${currentTab === type ? "rounded-sm border-[#F8D3B0] bg-[#fff6ee]  text-[#EA6A25]" : "border-[#F7F7F7] bg-[#f6f6f7] text-black"}`}
                onClick={onClick}
              >
                {label}
              </button>
            ),
        )}
      </div>
      <div className="flex w-full items-center gap-4">
        <SearchBar
          placeholder="Search Campaigns"
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />
        <SortSelect options={SORT_LIST_PROJECTS} onValueChange={handleSort} />
      </div>
      <div className="min-h-100 w-full">{content}</div>
    </div>
  );
};
