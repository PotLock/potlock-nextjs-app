import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import useRegistration from "@/entities/core/hooks/useRegistration";
import { tabRoutesProfile, tabRoutesProject } from "@/entities/profile/tabRoutes";
import ProjectBanner from "@/entities/project/components/ProjectBanner";

import Info from "./Info";
import { ProfileBanner } from "./ProfileBanner";
import Tabs from "./Tabs";

type Props = {
  children: React.ReactNode;
};

export function ProfileLayout({ children }: Props) {
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
    <main className="container flex flex-col">
      {isProject && <ProjectBanner projectId={params.userId} />}
      <ProfileBanner isProject={isProject} accountId={params.userId} />
      <Info accountId={params.userId} isProject={isProject} />
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
    </main>
  );
}
