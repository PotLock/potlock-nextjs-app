import { PageWithBanner } from "@/common/ui/components";
import { CampaignBanner } from "@/modules/campaigns/components/CampaignBanner";
import { CampaignsList } from "@/modules/campaigns/components/CampaignsList";
import { FeaturedCampaigns } from "@/modules/campaigns/components/FeaturedCampaigns";

export default function Campaigns() {
  return (
    <PageWithBanner>
      <CampaignBanner />
      <FeaturedCampaigns />
      <CampaignsList />
    </PageWithBanner>
  );
}
