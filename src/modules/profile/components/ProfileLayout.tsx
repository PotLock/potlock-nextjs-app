import { useState } from "react";

import { useRouter } from "next/router";

import Info from "@/modules/profile/components/Info";
import ProfileBanner from "@/modules/profile/components/ProfileBanner";
import Tabs from "@/modules/profile/components/Tabs";
import tabRoutes from "@/modules/profile/tabRoutes";
import ProjectBanner from "@/modules/project/components/ProjectBanner";

type Props = {
  children: React.ReactNode;
};

export function ProfileLayout({ children }: Props) {
  const router = useRouter();
  const params = router.query as { userId?: string };
  const pathname = router.pathname;

  const [selectedTab, setSelectedTab] = useState(
    tabRoutes.find((tab) => pathname.includes(tab.href)) || tabRoutes[0],
  );

  if (!params.userId) {
    return "";
  }

  return (
    <main className="container flex flex-col">
      <ProjectBanner projectId={params.userId} />
      <ProfileBanner isProject={true} accountId={params.userId} />
      <Info accountId={params.userId} />
      <Tabs
        asLink
        navOptions={tabRoutes}
        selectedTab={selectedTab.id}
        onSelect={(tabId: string) => {
          setSelectedTab(tabRoutes.find((tabRoute) => tabRoute.id === tabId)!);
        }}
      />

      {/* Tab Content */}
      <div className="md:px-[4.5rem] flex w-full flex-row flex-wrap gap-2 px-[1rem]">
        {children}
      </div>
    </main>
  );
}
