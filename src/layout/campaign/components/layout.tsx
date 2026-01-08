import { useMemo } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { PageWithBanner } from "@/common/ui/layout/components";
import { TabOption } from "@/common/ui/layout/types";
import { cn } from "@/common/ui/layout/utils";
import { CampaignBanner } from "@/entities/campaign";

const CAMPAIGN_TABS: { label: string; id: string }[] = [
  { label: "Donation History", id: "leaderboard" },
  { label: "Settings", id: "settings" },
];

type TabsProps = {
  options: { label: string; id: string }[];
  selectedTab: string;
  campaignId: string;
};

const Tabs = ({ options, selectedTab, campaignId }: TabsProps) => {
  const activeTab = selectedTab || options[0].id;

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
            const selected = option.id === activeTab;

            return (
              <Link
                key={option.id}
                href={`/campaign/${campaignId}?tab=${option.id}`}
                shallow
                prefetch
                className={cn(
                  "font-500 border-b-solid transition-duration-300 whitespace-nowrap",
                  "border-b-[2px] px-4 py-[10px] text-sm text-[#7b7b7b] transition-all",
                  "hover:border-b-[#292929] hover:text-[#292929]",
                  selected ? "border-b-[#292929] text-[#292929]" : "border-b-[transparent]",
                )}
              >
                {option.label}
              </Link>
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

  // Derive active tab from URL query param
  const activeTab = useMemo(() => {
    if (tab && CAMPAIGN_TABS.some((t) => t.id === tab)) {
      return tab;
    }
    return CAMPAIGN_TABS[0].id;
  }, [tab]);

  return (
    <PageWithBanner>
      <div className="md:p-8">
        <CampaignBanner campaignId={parseInt(campaignId)} />
      </div>
      <Tabs options={CAMPAIGN_TABS} selectedTab={activeTab} campaignId={campaignId} />
      <div className="flex w-full flex-row flex-wrap gap-2 md:px-8">{children}</div>
    </PageWithBanner>
  );
};
