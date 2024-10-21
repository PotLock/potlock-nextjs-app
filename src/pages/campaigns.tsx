import { useEffect, useState } from "react";

import { Campaign } from "@/common/contracts/potlock";
import { get_campaigns } from "@/common/contracts/potlock/campaigns";
import { PageWithBanner } from "@/common/ui/components";
import { CampaignBanner } from "@/modules/campaigns/components/CampaignBanner";
import { CampaignsList } from "@/modules/campaigns/components/CampaignsList";
import { FeaturedCampaigns } from "@/modules/campaigns/components/FeaturedCampaigns";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const getCampaigns = async () => {
      try {
        const fetchedCampaigns = await get_campaigns();
        setCampaigns(fetchedCampaigns);
      } catch (error) {
        console.log(error);
      }
    };
    getCampaigns();
  }, []);

  return (
    <PageWithBanner>
      <CampaignBanner />
      <FeaturedCampaigns data={campaigns} />
      <CampaignsList campaigns={campaigns} />
    </PageWithBanner>
  );
}
