import React from "react";

import { PageWithBanner } from "@/common/ui/components";
import { CreateListHero } from "@/modules/lists/components/CreateListHero";
import { ListFormDetails } from "@/modules/lists/components/ListFormDetails";

export default function Page() {
  return (
    <PageWithBanner>
      <CreateListHero onEditPage />
      <ListFormDetails />
    </PageWithBanner>
  );
}
