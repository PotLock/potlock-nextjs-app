import { useEffect, useState } from "react";

import { Campaign, campaignsClient } from "@/common/contracts/core";
import { PageWithBanner } from "@/common/ui/components";
import { CampaignBanner } from "@/entities/campaign/components/CampaignBanner";
import { CampaignsList } from "@/entities/campaign/components/CampaignsList";
import { FeaturedCampaigns } from "@/entities/campaign/components/FeaturedCampaigns";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    campaignsClient
      .get_campaigns()
      .then((fetchedCampaigns) => {
        setCampaigns(fetchedCampaigns);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <PageWithBanner>
      <CampaignBanner />
      <FeaturedCampaigns data={campaigns} />
      <CampaignsList campaigns={campaigns} />
    </PageWithBanner>
  );
}
