import { useEffect } from "react";

import { get_campaigns } from "@/common/contracts/potlock/campaigns";
import { PageWithBanner } from "@/common/ui/components";
import { CampaignBanner } from "@/modules/campaigns/components/CampaignBanner";
import { CampaignsList } from "@/modules/campaigns/components/CampaignsList";
import { FeaturedCampaigns } from "@/modules/campaigns/components/FeaturedCampaigns";

export default function Campaigns() {
  useEffect(() => {
    const getCampaigns = async () => {
      try {
        const campaigns = await get_campaigns();
        console.log(campaigns);
      } catch (error) {
        console.log(error);
      }
    };
    getCampaigns();
  }, []);
  return (
    <PageWithBanner>
      <CampaignBanner />
      <FeaturedCampaigns />
      <CampaignsList />
    </PageWithBanner>
  );
}
