import { useEffect, useMemo, useState } from "react";

import { Campaign } from "@/common/api/indexer";
import {
  Filter,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  SearchBar,
  SortSelect,
} from "@/common/ui/layout/components";

import { CampaignCard } from "./CampaignCard";
import { CampaignCardSkeleton } from "./CampaignCardSkeleton";
import { useAllCampaignLists } from "../hooks/useCampaigns";

export const CampaignsList = () => {
  const [search, setSearch] = useState("");
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);

  const {
    buttons,
    campaigns,
    loading,
    currentTab,
    tagsList,
    pagination,
  } = useAllCampaignLists();

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
        <div className="my-10 grid gap-2 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <CampaignCardSkeleton key={`skeleton-${index}`} />
          ))}
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
        <Filter groups={tagsList} />
        <SortSelect options={SORT_LIST_PROJECTS} onValueChange={handleSort} />
      </div>
      <div className="min-h-100 w-full">{content}</div>

      {/* Pagination - Only show for ALL_CAMPAIGNS */}
      {currentTab === "ALL_CAMPAIGNS" &&
        pagination.totalPages > 1 &&
        !loading &&
        filteredCampaigns.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.hasPreviousPage) {
                        pagination.setCurrentPage(pagination.currentPage - 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={
                      !pagination.hasPreviousPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={(e) => {
                          e.preventDefault();
                          pagination.setCurrentPage(pageNum);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        isActive={pagination.currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.hasNextPage) {
                        pagination.setCurrentPage(pagination.currentPage + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={
                      !pagination.hasNextPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
    </div>
  );
};
