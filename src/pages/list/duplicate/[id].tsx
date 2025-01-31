import { useRouter } from "next/router";

import { PageWithBanner } from "@/common/ui/components";
import { CreateListHero, ListFormDetails } from "@/entities/list";

export default function DuplicateList() {
  const router = useRouter();
  const { id } = router.query as { id: string };

  return (
    <PageWithBanner>
      <CreateListHero onEditPage text="Duplicate List" />
      <ListFormDetails isDuplicate listId={parseInt(id)} />
    </PageWithBanner>
  );
}
