import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { nearProtocolHooks } from "@/common/blockchains/near-protocol";
import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { listsContractHooks } from "@/common/contracts/core/lists";
import type { AccountId } from "@/common/types";
import { PageWithBanner } from "@/common/ui/layout/components";
import { TabOption } from "@/common/ui/layout/types";
import { cn } from "@/common/ui/layout/utils";
import { routeSelectors } from "@/pathnames";

import { ProfileLayoutHeader } from "./header";
import { ProfileLayoutHero } from "./hero";
import { ProfileLayoutSummary } from "./summary";

const tabRoutesProject = [
  {
    label: "Home",
    id: "home",
    href: "/home",
  },

  {
    label: "Feed",
    id: "feed",
    href: "/feed",
  },

  {
    label: "Pots",
    id: "pots",
    href: "/pots",
  },

  {
    label: "Funding Raised",
    id: "funding",
    href: "/funding-raised",
  },

  {
    label: "Donations",
    id: "donations",
    href: "/donations",
  },

  {
    label: "Lists",
    id: "lists",
    href: "/lists",
  },

  {
    label: "Campaigns",
    id: "campaigns",
    href: "/campaigns",
  },
] as TabOption[];

const tabRoutesProfile = [
  {
    label: "Home",
    id: "home",
    href: "/home",
  },

  {
    label: "Donations",
    id: "donations",
    href: "/donations",
  },

  {
    label: "Funding Raised",
    id: "funding",
    href: "/funding-raised",
  },
] as TabOption[];

type ProfileLayoutTabPanelProps = {
  options: TabOption[];
  selectedTab: string;
  onSelect?: (tabId: string) => void;
  asLink?: boolean;
};

const Tabs: React.FC<ProfileLayoutTabPanelProps> = ({ options, selectedTab, onSelect, asLink }) => {
  const router = useRouter();
  const { accountId } = router.query as { accountId: AccountId };
  const _selectedTab = selectedTab || options[0].id;

  return (
    <div className="mb-[46px] flex w-full flex-row flex-wrap gap-2">
      <div className="w-full px-[1rem]  md:px-[4.5rem]">
        <div
          className={cn(
            "border-b-solid flex w-full justify-start gap-8 overflow-y-auto",
            "border-b-[1px] border-b-[#c7c7c7] pt-8",
          )}
        >
          {options.map((option) => {
            const selected = option.id == _selectedTab;

            if (asLink) {
              return (
                <Link
                  href={`/profile/${accountId}${option.href}`}
                  key={option.id}
                  className={cn(
                    "font-500 border-b-solid transition-duration-300 whitespace-nowrap",
                    "border-b-[2px] px-4 py-[10px] text-sm text-[#7b7b7b] transition-all",
                    "hover:border-b-[#292929] hover:text-[#292929]",

                    {
                      "border-b-[#292929] text-[#292929]": selected,
                      "border-b-[transparent]": !selected,
                    },
                  )}
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
                className={cn(
                  "font-500 border-b-solid transition-duration-300 whitespace-nowrap",
                  "border-b-[2px] px-4 py-[10px] text-sm text-[#7b7b7b] transition-all",
                  "hover:border-b-[#292929] hover:text-[#292929]",

                  {
                    "border-b-[#292929] text-[#292929]": selected,
                    "border-b-[transparent]": !selected,
                  },
                )}
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

export type ProfileLayoutProps = {
  children: React.ReactNode;
};

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { accountId } = router.query as { accountId: AccountId };

  const {
    isLoading: isAccountViewLoading,
    data: accountView,
    error: accountViewError,
  } = nearProtocolHooks.useViewAccount({ accountId });

  const { data: isRegistered } = listsContractHooks.useIsRegistered({
    listId: PUBLIC_GOODS_REGISTRY_LIST_ID,
    accountId,
  });

  const tabs = isRegistered ? tabRoutesProject : tabRoutesProfile;

  const [selectedTab, setSelectedTab] = useState(
    tabs.find((tab) => router.pathname.includes(tab.href)) || tabs[0],
  );

  useEffect(() => {
    if (!isAccountViewLoading && accountView === undefined && accountViewError !== undefined) {
      router.replace("/404", { pathname: routeSelectors.PROFILE_BY_ID("404") });
    } else {
      setSelectedTab(tabs.find((tab) => router.pathname.includes(tab.href)) || tabs[0]);
    }
  }, [accountId, accountView, accountViewError, isAccountViewLoading, router, tabs]);

  return (
    <PageWithBanner>
      <ProfileLayoutHeader {...{ accountId }} />
      <ProfileLayoutHero {...{ accountId }} />
      <ProfileLayoutSummary {...{ accountId }} />

      <Tabs
        asLink
        options={tabs}
        selectedTab={selectedTab.id}
        onSelect={(tabId: string) => {
          setSelectedTab(tabs.find((tabRoute) => tabRoute.id === tabId)!);
        }}
      />

      {/* Tab Content */}
      <div className="flex w-full flex-row flex-wrap gap-2 px-[1rem] md:px-[4.5rem]">
        {children}
      </div>
    </PageWithBanner>
  );
};
