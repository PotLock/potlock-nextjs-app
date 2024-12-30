import { PageWithBanner } from "@/common/ui/components";
import { CreateListHero } from "@/entities/list/components/CreateListHero";
import { ListFormDetails } from "@/entities/list/components/ListFormDetails";

export default function DuplicateList() {
  return (
    <PageWithBanner>
      <CreateListHero onEditPage text="Duplicate List" />
      <ListFormDetails isDuplicate />
    </PageWithBanner>
  );
}
