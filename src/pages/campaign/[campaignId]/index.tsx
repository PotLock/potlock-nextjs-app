import { SplashScreen } from "@/common/ui/layout/components";
import { CampaignLayout } from "@/layout/campaign/components/layout";

/**
 * Simply shows the splash screen during redirect.
 */
export default function CampaignRootPage() {
  return <SplashScreen />;
}

CampaignRootPage.getLayout = function getLayout(page: React.ReactNode) {
  return <CampaignLayout>{page}</CampaignLayout>;
};
