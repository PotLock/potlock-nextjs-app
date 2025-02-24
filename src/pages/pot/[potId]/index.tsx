import { SplashScreen } from "@/common/ui/layout/components";
import { PotLayout } from "@/layout/pot/components/layout";

/**
 * Facilitates tab redirects, as Nextjs's middleware doesn't cover
 *  use cases involving dynamic tab navigation.
 */
export default function PotPage() {
  return <SplashScreen />;
}

PotPage.getLayout = function getLayout(page: React.ReactNode) {
  return <PotLayout>{page}</PotLayout>;
};
