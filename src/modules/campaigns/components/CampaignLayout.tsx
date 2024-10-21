import { useState } from "react";

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
  const params = router.query as { campaignId: string };
  const pathname = router.pathname;

  const tabs = CAMPAIGN_TAB_ROUTES;

  const [selectedTab, setSelectedTab] = useState(
    tabs.find((tab) => pathname.includes(tab.href)) || tabs[0],
  );

  return (
    <PageWithBanner>
      <div className="p-8">
        <SingleCampaignBanner />
      </div>
      <Tabs
        asLink
        navOptions={tabs}
        selectedTab={selectedTab.id}
        onSelect={(tabId: string) => {
          setSelectedTab(tabs.find((tabRoute) => tabRoute.id === tabId)!);
        }}
      />
      <div className="md:px-8 flex w-full flex-row flex-wrap gap-2 px-[1rem]">
        {children}
      </div>
    </PageWithBanner>
  );
};
