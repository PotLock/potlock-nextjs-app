import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { useRegistration } from "@/common/_deprecated/useRegistration";
import { PageWithBanner } from "@/common/ui/components";
import { TabOption } from "@/common/ui/types";
import { ProjectBanner } from "@/entities/project";

import { ProfileLayoutControls } from "./ProfileLayoutControls";
import { ProfileLayoutHero } from "./ProfileLayoutHero";

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
  // INFO: It's needed to have home for regular users as well as pages redirection sends user to /home page (check middleware.ts file)
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
] as TabOption[];

type ProfileLayoutTabPanelProps = {
  options: TabOption[];
  selectedTab: string;
  onSelect?: (tabId: string) => void;
  asLink?: boolean;
};

const Tabs: React.FC<ProfileLayoutTabPanelProps> = ({ options, selectedTab, onSelect, asLink }) => {
  const _selectedTab = selectedTab || options[0].id;

  const router = useRouter();
  const { userId: userIdPathParam } = router.query;

  const userId = typeof userIdPathParam === "string" ? userIdPathParam : userIdPathParam?.at(0);

  return (
    <div className="mb-[46px] flex w-full flex-row flex-wrap gap-2">
      <div className="w-full px-[1rem]  md:px-[4.5rem]">
        <div className="border-b-solid flex w-full justify-start gap-8 overflow-y-auto border-b-[1px] border-b-[#c7c7c7] pt-8">
          {options.map((option) => {
            const selected = option.id == _selectedTab;

            if (asLink) {
              return (
                <Link
                  href={`/profile/${userId}${option.href}`}
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

export type ProfileLayoutProps = {
  children: React.ReactNode;
};

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  const router = useRouter();
  const params = router.query as { userId?: string };
  const pathname = router.pathname;

  // Load profile data
  const { isRegisteredProject } = useRegistration(params.userId || "");

  const tabs = isRegisteredProject ? tabRoutesProject : tabRoutesProfile;

  const [selectedTab, setSelectedTab] = useState(
    tabs.find((tab) => pathname.includes(tab.href)) || tabs[0],
  );

  useEffect(() => {
    setSelectedTab(tabs.find((tab) => pathname.includes(tab.href)) || tabs[0]);
  }, [pathname, tabs]);

  if (!params.userId) {
    return "";
  }

  const isProject = isRegisteredProject;

  return (
    <PageWithBanner>
      {isProject && <ProjectBanner projectId={params.userId} />}
      <ProfileLayoutHero isProject={isProject} accountId={params.userId} />
      <ProfileLayoutControls accountId={params.userId} isProject={isProject} />

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
