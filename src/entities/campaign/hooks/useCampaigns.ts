import { useMemo, useState } from "react";

import { Campaign, indexer } from "@/common/api/indexer";
import { NOOP_STRING } from "@/common/constants";
import { useWalletUserSession } from "@/common/wallet";

enum CampaignTab {
  ALL_CAMPAIGNS = "ALL_CAMPAIGNS",
  ACTIVE_CAMPAIGNS = "ACTIVE_CAMPAIGNS",
  MY_CAMPAIGNS = "MY_CAMPAIGNS",
}

export const useAllCampaignLists = () => {
  const viewer = useWalletUserSession();
  const [currentTab, setCurrentTab] = useState<CampaignTab>(CampaignTab.ALL_CAMPAIGNS);

  const { data: campaigns, isLoading: isCampaignsLoading } = indexer.useCampaigns({
    page: 1,
    page_size: 300,
    ...(currentTab === CampaignTab.MY_CAMPAIGNS && { owner: viewer.accountId ?? NOOP_STRING }),
    ...(currentTab === CampaignTab.ACTIVE_CAMPAIGNS && { status: "active" }),
  });

  const buttons = useMemo(
    () => [
      {
        label: "All Campaigns",
        type: CampaignTab.ALL_CAMPAIGNS,
        onClick: () => setCurrentTab(CampaignTab.ALL_CAMPAIGNS),
      },
      {
        label: "Active Campaigns",
        type: CampaignTab.ACTIVE_CAMPAIGNS,
        onClick: () => setCurrentTab(CampaignTab.ACTIVE_CAMPAIGNS),
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

  return {
    buttons,
    currentTab,
    campaigns: campaigns?.results || [],
    loading: isCampaignsLoading,
  };
};
