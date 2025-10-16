import { useMemo, useState } from "react";

import { Campaign, V1CampaignsRetrieveStatus, indexer } from "@/common/api/indexer";
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

  const { data: campaigns, isLoading: isCampaignsLoading } = indexer.useCampaigns({
    page: 1,
    page_size: 300,
    ...(currentTab === CampaignTab.MY_CAMPAIGNS && { owner: viewer.accountId ?? NOOP_STRING }),
    ...(statusFilter !== "all" && { status: statusFilter as V1CampaignsRetrieveStatus }),
  });

  const buttons = useMemo(
    () => [
      {
        label: "All Campaigns",
        type: CampaignTab.ALL_CAMPAIGNS,
        onClick: () => setCurrentTab(CampaignTab.ALL_CAMPAIGNS),
      },
      {
        label: "My Campaigns",
        type: CampaignTab.MY_CAMPAIGNS,
        onClick: () => setCurrentTab(CampaignTab.MY_CAMPAIGNS),
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
        onValueChange: (value) => {
          setsStatusFilter(value);
        },
      },
    },
  ];

  return {
    buttons,
    tagsList,
    currentTab,
    campaigns: campaigns?.results || [],
    loading: isCampaignsLoading,
  };
};
