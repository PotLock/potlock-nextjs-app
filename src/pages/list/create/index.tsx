import React from "react";

import { PageWithBanner } from "@/common/ui/components";
import { CreateListHero } from "@/entities/list/components/CreateListHero";
import { ListFormDetails } from "@/entities/list/components/ListFormDetails";

export default function Page() {
  return (
    <PageWithBanner>
      <CreateListHero onEditPage={false} />
      <ListFormDetails />
    </PageWithBanner>
  );
}
