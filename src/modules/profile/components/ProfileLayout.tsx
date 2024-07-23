import { useState } from "react";

import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

import Info from "@/modules/profile/components/Info";
import ProfileBanner from "@/modules/profile/components/ProfileBanner";
import Tabs from "@/modules/profile/components/Tabs";
import tabRoutes from "@/modules/profile/tabRoutes";
import ProjectBanner from "@/modules/project/components/ProjectBanner";

type Props = {
  children: React.ReactNode;
  // params: { userId: string };
};

export function ProfileLayout({ children }: Props) {
  const params = useRouter().query as { userId?: string };

  const pathname = usePathname();
  const [selectedTab, setSelectedTab] = useState(
    tabRoutes.find((tab) => pathname.includes(tab.href)) || tabRoutes[0],
  );

  if (!params.userId) {
    return "";
  }

  return (
    <main className="flex flex-col">
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
