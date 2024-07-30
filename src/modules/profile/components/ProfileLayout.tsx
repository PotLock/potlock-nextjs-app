import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import useRegistration from "@/modules/core/hooks/useRegistration";
import Info from "@/modules/profile/components/Info";
import ProfileBanner from "@/modules/profile/components/ProfileBanner";
import Tabs from "@/modules/profile/components/Tabs";
import {
  tabRoutesProfile,
  tabRoutesProject,
} from "@/modules/profile/tabRoutes";
import ProjectBanner from "@/modules/project/components/ProjectBanner";

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
    <main className="flex flex-col">
      {isProject && <ProjectBanner projectId={params.userId} />}
      <ProfileBanner isProject={isProject} accountId={params.userId} />
      <Info accountId={params.userId} isProject={isProject} />
      <Tabs
        asLink
        navOptions={tabs}
        selectedTab={selectedTab.id}
        onSelect={(tabId: string) => {
          setSelectedTab(tabs.find((tabRoute) => tabRoute.id === tabId)!);
        }}
      />

      {/* Tab Content */}
      <div className="md:px-[4.5rem] flex w-full flex-row flex-wrap gap-2 px-[1rem]">
        {children}
      </div>
    </main>
  );
}
