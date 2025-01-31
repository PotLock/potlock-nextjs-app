import React from "react";

import { useRouter } from "next/router";

import { PageWithBanner } from "@/common/ui/components";
import { CreateListHero, ListFormDetails } from "@/entities/list";

export default function Page() {
  const router = useRouter();
  const { id } = router.query as { id: string };

  return (
    <PageWithBanner>
      <CreateListHero onEditPage />
      <ListFormDetails listId={parseInt(id)} />
    </PageWithBanner>
  );
}
