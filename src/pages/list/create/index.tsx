import { PageWithBanner } from "@/common/ui/components";
import { CreateListHero, ListFormDetails } from "@/entities/list";

export default function Page() {
  return (
    <PageWithBanner>
      <CreateListHero onEditPage={false} />
      <ListFormDetails />
    </PageWithBanner>
  );
}
