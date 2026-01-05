import { useCallback, useMemo, useState } from "react";

import { useRouter } from "next/router";

import { PageWithBanner } from "@/common/ui/layout/components";
import { TabOption } from "@/common/ui/layout/types";
import { cn } from "@/common/ui/layout/utils";
import { CampaignBanner, CampaignDonorsTable, CampaignSettings } from "@/entities/campaign";

const CAMPAIGN_TABS: {label: string; id: string}[] = [
  {
    label: "Donation History",
    id: "leaderboard",
  },
  { label: "Settings", id: "settings" },
];

type TabsProps = {
  options: {label: string; id: string}[];
  selectedTab: string;
  onSelect: (tabId: string) => void;
};

const Tabs = ({ options, selectedTab, onSelect }: TabsProps) => {
  return (
    <div className="mb-8 flex w-full flex-row flex-wrap gap-2">
      <div className="w-full px-2 md:px-8">
        <div
          className={cn(
            "flex w-full justify-start gap-8 overflow-y-auto",
            "border-b-[1px] border-b-[#c7c7c7] pt-8",
          )}
        >
          {options.map((option) => {
            const selected = option.id === selectedTab;

            return (
              <button
                key={option.id}
                className={`font-500 border-b-solid transition-duration-300 whitespace-nowrap border-b-[2px] px-4 py-[10px] text-sm text-[#7b7b7b] transition-all hover:border-b-[#292929] hover:text-[#292929] ${selected ? "border-b-[#292929] text-[#292929]" : "border-b-[transparent]"}`}
                onClick={() => onSelect(option.id)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

type ReactLayoutProps = {
  children: React.ReactNode;
};

export const CampaignLayout: React.FC<ReactLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { campaignId, tab } = router.query as { campaignId: string; tab?: string };

  // Derive active tab directly from URL - no state needed
  const activeTab = useMemo(() => {
    if (tab && CAMPAIGN_TABS.find((t) => t.id === tab)) {
      return tab;
    }

    return CAMPAIGN_TABS[0].id;
  }, [tab]);

  // Track if user has manually changed tabs (to prevent URL sync issues)
  const [userSelectedTab, setUserSelectedTab] = useState<string | null>(null);

  // Use userSelectedTab if set, otherwise use URL-derived activeTab
  const currentTab = userSelectedTab ?? activeTab;

  const handleTabChange = useCallback(
    (tabId: string) => {
      if (tabId === currentTab) return;

      setUserSelectedTab(tabId);

      // Update URL without triggering Next.js navigation
      const newUrl = `/campaign/${campaignId}?tab=${tabId}`;

      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
    },
    [campaignId, currentTab],
  );

  const numericCampaignId = parseInt(campaignId || "0", 10);

  // Render content based on current tab
  const renderTabContent = () => {
    if (currentTab === "settings") {
      return <CampaignSettings campaignId={numericCampaignId} />;
    }

    return <CampaignDonorsTable campaignId={numericCampaignId} />;
  };

  // Don't render until we have a campaignId
  if (!campaignId) {
    return null;
  }

  return (
    <PageWithBanner>
      <div className="md:p-8">
        <CampaignBanner campaignId={numericCampaignId} />
      </div>

      <Tabs options={CAMPAIGN_TABS} selectedTab={currentTab} onSelect={handleTabChange} />
      <div className="flex w-full flex-row flex-wrap gap-2 md:px-8">{renderTabContent()}</div>
    </PageWithBanner>
  );
};

export { CAMPAIGN_TABS };
