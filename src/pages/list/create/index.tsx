import { PageWithBanner } from "@/common/ui/layout/components";
import { CreateListHero, ListFormDetails, useListDeploymentSuccessRedirect } from "@/entities/list";

export default function Page() {
  useListDeploymentSuccessRedirect();
  return (
    <PageWithBanner>
      <CreateListHero onEditPage={false} />
      <ListFormDetails />
    </PageWithBanner>
  );
}
