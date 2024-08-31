import { PageWithBanner } from "@/common/ui/components";
import ActivePots from "@/modules/pot/components/ActivePots";
import Banner from "@/modules/pot/components/Banner";

export default function PotsPage() {
  return (
    <PageWithBanner>
      <Banner />
      <ActivePots />
    </PageWithBanner>
  );
}
