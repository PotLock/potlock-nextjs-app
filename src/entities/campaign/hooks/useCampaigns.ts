import { useCallback, useEffect, useMemo, useState } from "react";

import { Campaign, campaignsContractHooks } from "@/common/contracts/core/campaigns";
import { useWalletUserSession } from "@/common/wallet";

enum CampaignTab {
  ALL_CAMPAIGNS = "ALL_CAMPAIGNS",
  MY_CAMPAIGNS = "MY_CAMPAIGNS",
}

export const useAllCampaignLists = () => {
  const viewer = useWalletUserSession();
  const [currentTab, setCurrentTab] = useState<CampaignTab>(CampaignTab.ALL_CAMPAIGNS);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);

  const { data: allCampaigns, isLoading: isAllCampaignsLoading } =
    campaignsContractHooks.useCampaigns();

  const { data: ownerCampaigns, isLoading: loadingOwnerCampaigns } =
    campaignsContractHooks.useOwnedCampaigns({
      accountId: viewer.accountId ?? "noop",
    });

  const fetchAllCampaigns = useCallback(() => {
    setCurrentTab(CampaignTab.ALL_CAMPAIGNS);
    setFilteredCampaigns(allCampaigns || []);
  }, [allCampaigns]);

  const fetchMyCampaigns = useCallback(() => {
    if (!viewer.isSignedIn) return;
    setCurrentTab(CampaignTab.MY_CAMPAIGNS);
    setFilteredCampaigns(ownerCampaigns || []);
  }, [ownerCampaigns, viewer?.isSignedIn]);

  useEffect(() => {
    fetchAllCampaigns();
  }, [fetchAllCampaigns]);

  const actions = useMemo(
    () => [
      {
        label: "All Campaigns",
        type: CampaignTab.ALL_CAMPAIGNS,
        onClick: fetchAllCampaigns,
      },
      {
        label: "My Campaigns",
        type: CampaignTab.MY_CAMPAIGNS,
        onClick: fetchMyCampaigns,
        condition: viewer.isSignedIn,
      },
    ],
    [fetchAllCampaigns, fetchMyCampaigns, viewer.isSignedIn],
  );

  return {
    buttons: actions,
    currentTab,
    campaigns: filteredCampaigns,
    loading: isAllCampaignsLoading || loadingOwnerCampaigns,
  };
};
