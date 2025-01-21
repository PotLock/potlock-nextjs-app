import { PageWithBanner } from "@/common/ui/components";
import { CreateListHero, ListFormDetails } from "@/entities/list";

export default function DuplicateList() {
  return (
    <PageWithBanner>
      <CreateListHero onEditPage text="Duplicate List" />
      <ListFormDetails isDuplicate />
    </PageWithBanner>
  );
}
