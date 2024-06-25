"use client";

import { useState } from "react";

import Info from "@/modules/profile/components/Info";
import ProfileBanner from "@/modules/profile/components/ProfileBanner";
import Tabs from "@/modules/profile/components/Tabs";
import tabRoutes from "@/modules/profile/tabRoutes";
import ProjectBanner from "@/modules/project/components/ProjectBanner";

export default function User({ params }: { params: { userId: string } }) {
  const [selectedTab, setSelectedTab] = useState(tabRoutes[0]);

  return (
    <main className="flex flex-col">
      <ProjectBanner projectId={params.userId} />
      <ProfileBanner isProject={true} accountId={params.userId} />
      <Info accountId={params.userId} />
      <Tabs
        navOptions={tabRoutes}
        selectedTab={selectedTab.id}
        onSelect={(tabId: string) => {
          setSelectedTab(tabRoutes.find((tabRoute) => tabRoute.id === tabId)!);
        }}
      />

      {/* Tab Content */}
      <div className="flex w-full flex-row flex-wrap gap-2 px-[1rem] md:px-[4.5rem]">
        <selectedTab.Component />
      </div>
    </main>
  );
}
