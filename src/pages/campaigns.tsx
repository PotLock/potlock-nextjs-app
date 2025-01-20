import { useEffect, useState } from "react";

import { isClient } from "@wpdas/naxios";

import { WalletProvider } from "@/common/contexts/wallet";
import { Campaign, campaignsContractClient } from "@/common/contracts/core";
import { PageWithBanner, SplashScreen } from "@/common/ui/components";
import { CampaignBanner } from "@/entities/campaign/components/CampaignBanner";
import { CampaignsList } from "@/entities/campaign/components/CampaignsList";
import { FeaturedCampaigns } from "@/entities/campaign/components/FeaturedCampaigns";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    campaignsContractClient
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

CampaignsPage.getLayout = function getLayout(page: React.ReactNode) {
  return isClient() ? <WalletProvider>{page}</WalletProvider> : <SplashScreen className="h-200" />;
};
