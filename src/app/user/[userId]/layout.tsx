"use client";

import { useState } from "react";

import { usePathname } from "next/navigation";

import { ProfileBanner, ProfileInfo } from "@/modules/profile";
import Tabs from "@/modules/profile/components/Tabs";
import tabRoutes from "@/modules/profile/tabRoutes";
import { ProjectBanner } from "@/modules/project";

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { userId: string };
}>) {
  const pathname = usePathname();

  const [selectedTab, setSelectedTab] = useState(
    tabRoutes.find((tab) => pathname.includes(tab.href)) || tabRoutes[0],
  );

  return (
    <main className="flex flex-col">
      <ProjectBanner projectId={params.userId} />
      <ProfileBanner isProject={true} accountId={params.userId} />
      <ProfileInfo accountId={params.userId} />

      <Tabs
        asLink
        navOptions={tabRoutes}
        selectedTab={selectedTab.id}
        onSelect={(tabId: string) => {
          setSelectedTab(tabRoutes.find((tabRoute) => tabRoute.id === tabId)!);
        }}
      />

      {/* Tab Content */}
      <div className="flex w-full flex-row flex-wrap gap-2 px-[1rem] md:px-[4.5rem]">
        {children}
      </div>
    </main>
  );
}
