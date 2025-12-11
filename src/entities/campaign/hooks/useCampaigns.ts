import { useMemo, useState } from "react";

import { V1CampaignsRetrieveStatus, indexer } from "@/common/api/indexer";
import { NOOP_STRING } from "@/common/constants";
import { Group, GroupType } from "@/common/ui/layout/components";
import { useWalletUserSession } from "@/common/wallet";

import { CAMPAIGN_STATUS_OPTIONS } from "../utils/constants";

enum CampaignTab {
  ALL_CAMPAIGNS = "ALL_CAMPAIGNS",
  MY_CAMPAIGNS = "MY_CAMPAIGNS",
}

export const useAllCampaignLists = () => {
  const viewer = useWalletUserSession();
  const [currentTab, setCurrentTab] = useState<CampaignTab>(CampaignTab.ALL_CAMPAIGNS);
  const [statusFilter, setsStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Only paginate for ALL_CAMPAIGNS, use large page_size for MY_CAMPAIGNS
  const pageSize = currentTab === CampaignTab.ALL_CAMPAIGNS ? 20 : 300;

  const { data: campaignsData, isLoading: isCampaignsLoading } = indexer.useCampaigns({
    page: currentTab === CampaignTab.ALL_CAMPAIGNS ? currentPage : 1,
    page_size: pageSize,
    ...(currentTab === CampaignTab.MY_CAMPAIGNS && { owner: viewer.accountId ?? NOOP_STRING }),
    ...(statusFilter !== "all" && { status: statusFilter as V1CampaignsRetrieveStatus }),
  });

  // Reset to page 1 when tab or filter changes
  const handleTabChange = (tab: CampaignTab) => {
    setCurrentTab(tab);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setsStatusFilter(value);
    setCurrentPage(1);
  };

  const buttons = useMemo(
    () => [
      {
        label: "All Campaigns",
        type: CampaignTab.ALL_CAMPAIGNS,
        onClick: () => handleTabChange(CampaignTab.ALL_CAMPAIGNS),
      },
      {
        label: "My Campaigns",
        type: CampaignTab.MY_CAMPAIGNS,
        onClick: () => handleTabChange(CampaignTab.MY_CAMPAIGNS),
        condition: viewer.isSignedIn,
      },
    ],
    [viewer.isSignedIn],
  );

  const tagsList: Group<GroupType.single>[] = [
    {
      label: "Status",
      options: CAMPAIGN_STATUS_OPTIONS,
      type: GroupType.single,
      props: {
        value: statusFilter,
        onValueChange: handleStatusFilterChange,
      },
    },
  ];

  // Calculate pagination metadata
  const totalCount = campaignsData?.count ?? 0;

  const totalPages =
    currentTab === CampaignTab.ALL_CAMPAIGNS ? Math.ceil(totalCount / pageSize) : 1;

  const hasNextPage = currentTab === CampaignTab.ALL_CAMPAIGNS && !!campaignsData?.next;

  const hasPreviousPage = currentTab === CampaignTab.ALL_CAMPAIGNS && !!campaignsData?.previous;

  return {
    buttons,
    tagsList,
    currentTab,
    campaigns: campaignsData?.results || [],
    loading: isCampaignsLoading,
    pagination: {
      currentPage,
      totalPages,
      totalCount,
      hasNextPage,
      hasPreviousPage,
      setCurrentPage,
      pageSize,
    },
  };
};
