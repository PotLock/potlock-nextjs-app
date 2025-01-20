import { useCallback, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { PageWithBanner, SplashScreen } from "@/common/ui/components";
import { TabOption } from "@/common/ui/types";
import { cn } from "@/common/ui/utils";
import { ViewerSessionProvider } from "@/common/viewer";
import { SingleCampaignBanner } from "@/entities/campaign";

const CAMPAIGN_TAB_ROUTES: TabOption[] = [
  {
    label: "Leaderboard",
    id: "leaderboard",
    href: "/leaderboard",
  },

  // { label: "History", id: "history", href: "/history" },

  { label: "Settings", id: "settings", href: "/settings" },
];

type Props = {
  options: TabOption[];
  selectedTab: string;
  onSelect?: (tabId: string) => void;
  asLink?: boolean;
};

const Tabs = ({ options, selectedTab, onSelect, asLink }: Props) => {
  const _selectedTab = selectedTab || options[0].id;

  const router = useRouter();
  const { campaignId: campaignIdParam } = router.query;

  const campaignId = typeof campaignIdParam === "string" ? campaignIdParam : campaignIdParam?.at(0);

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
            const selected = option.id == _selectedTab;

            if (asLink) {
              return (
                <Link
                  href={`/campaign/${campaignId}${option.href}`}
                  key={option.id}
                  className={`font-500 border-b-solid transition-duration-300 whitespace-nowrap border-b-[2px] px-4 py-[10px] text-sm text-[#7b7b7b] transition-all hover:border-b-[#292929] hover:text-[#292929] ${selected ? "border-b-[#292929] text-[#292929]" : "border-b-[transparent]"}`}
                  onClick={() => {
                    if (onSelect) {
                      onSelect(option.id);
                    }
                  }}
                >
                  {option.label}
                </Link>
              );
            }

            return (
              <button
                key={option.id}
                className={`font-500 border-b-solid transition-duration-300 whitespace-nowrap border-b-[2px] px-4 py-[10px] text-sm text-[#7b7b7b] transition-all hover:border-b-[#292929] hover:text-[#292929] ${selected ? "border-b-[#292929] text-[#292929]" : "border-b-[transparent]"}`}
                onClick={() => {
                  if (onSelect) {
                    onSelect(option.id);
                  }
                }}
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
  const pathname = router.pathname;

  const tabs = CAMPAIGN_TAB_ROUTES;

  const [selectedTab, setSelectedTab] = useState(
    tabs.find((tab) => pathname.includes(tab.href)) || tabs[0],
  );

  const handleSelectedTab = useCallback(
    (tabId: string) => setSelectedTab(tabs.find((tabRoute) => tabRoute.id === tabId)!),
    [tabs],
  );

  return (
    <ViewerSessionProvider ssrFallback={<SplashScreen className="h-200" />}>
      <PageWithBanner>
        <div className="md:p-8">
          <SingleCampaignBanner />
        </div>
        <Tabs
          asLink
          options={tabs}
          selectedTab={selectedTab.id}
          onSelect={(tabId: string) => handleSelectedTab(tabId)}
        />
        <div className="flex w-full flex-row flex-wrap gap-2 md:px-8">{children}</div>
      </PageWithBanner>
    </ViewerSessionProvider>
  );
};
