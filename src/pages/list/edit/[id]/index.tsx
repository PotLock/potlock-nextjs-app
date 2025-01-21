import React from "react";

import { PageWithBanner, SplashScreen } from "@/common/ui/components";
import { ViewerSessionProvider } from "@/common/viewer";
import { CreateListHero, ListFormDetails } from "@/entities/list";

export default function Page() {
  return (
    <PageWithBanner>
      <CreateListHero onEditPage />

      <ViewerSessionProvider>
        <ListFormDetails />
      </ViewerSessionProvider>
    </PageWithBanner>
  );
}
