import { useCallback, useState } from "react";

import { useRouter } from "next/router";

import { PageWithBanner } from "@/common/ui/components";

import { CAMPAIGN_TAB_ROUTES } from "../constants";
import { SingleCampaignBanner } from "./SingleCampaignBanner";
import Tabs from "./Tabs";

type ReactLayoutProps = {
  children: React.ReactNode;
};

export const CampaignLayout: React.FC<ReactLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = router.pathname;

  const tabs = CAMPAIGN_TAB_ROUTES;

  const [selectedTab, setSelectedTab] = useState(
    tabs.find((tab) => pathname.includes(tab.href)) || tabs[0],
  );

  const handleSelectedTab = useCallback(
    (tabId: string) =>
      setSelectedTab(tabs.find((tabRoute) => tabRoute.id === tabId)!),
    [tabs],
  );

  return (
    <PageWithBanner>
      <div className="md:p-8">
        <SingleCampaignBanner />
      </div>
      <Tabs
        asLink
        navOptions={tabs}
        selectedTab={selectedTab.id}
        onSelect={(tabId: string) => handleSelectedTab(tabId)}
      />
      <div className="md:px-8 flex w-full flex-row flex-wrap gap-2">
        {children}
      </div>
    </PageWithBanner>
  );
};
