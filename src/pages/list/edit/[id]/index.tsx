import React from "react";

import { PageWithBanner } from "@/common/ui/components";
import { CreateListHero } from "@/entities/lists/components/CreateListHero";
import { ListFormDetails } from "@/entities/lists/components/ListFormDetails";

export default function Page() {
  return (
    <PageWithBanner>
      <CreateListHero onEditPage />
      <ListFormDetails />
    </PageWithBanner>
  );
}
