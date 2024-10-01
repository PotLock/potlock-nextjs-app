import React, { useState } from "react";

import { PageWithBanner } from "@/common/ui/components";
import AllLists from "@/modules/lists/components/AllLists";
import ListHero from "@/modules/lists/components/ListHero";
import { useListDeploymentSuccessRedirect } from "@/modules/lists/hooks/redirects";

export default function Page() {
  useListDeploymentSuccessRedirect();
  const [currentListType, setCurrentListType] = useState<string>("All Lists");
  const [filteredRegistrations, setFilteredRegistrations] = useState<any[]>([]);

  return (
    <PageWithBanner>
      <main>
        <ListHero
          setCurrentListType={setCurrentListType}
          setFilteredRegistrations={setFilteredRegistrations}
        />
        <AllLists
          currentListType={currentListType}
          setCurrentListType={setCurrentListType}
          filteredRegistrations={filteredRegistrations}
          setFilteredRegistrations={setFilteredRegistrations}
        />
      </main>
    </PageWithBanner>
  );
}
