import React from "react";

import { PageWithBanner } from "@/common/ui/components";
import { CreateListHero, ListFormDetails } from "@/entities/list";

export default function Page() {
  return (
    <PageWithBanner>
      <CreateListHero onEditPage />
      <ListFormDetails />
    </PageWithBanner>
  );
}
