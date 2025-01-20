import { PageWithBanner, SplashScreen } from "@/common/ui/components";
import { ViewerSessionProvider } from "@/common/viewer";
import { CreateListHero, ListFormDetails } from "@/entities/list";

export default function DuplicateList() {
  return (
    <PageWithBanner>
      <CreateListHero onEditPage text="Duplicate List" />

      <ViewerSessionProvider ssrFallback={<SplashScreen className="h-200" />}>
        <ListFormDetails isDuplicate />
      </ViewerSessionProvider>
    </PageWithBanner>
  );
}
