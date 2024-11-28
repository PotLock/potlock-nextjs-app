import { useEffect, useState } from "react";

import { Campaign, CampaignDonation, campaignsClient } from "@/common/contracts/core";

export const useCampaign = ({ campaignId }: { campaignId: string }) => {
  const [campaign, setCampaign] = useState<Campaign>();
  const [donations, setDonations] = useState<CampaignDonation[]>([]);

  useEffect(() => {
    campaignsClient
      .get_campaign({ campaign_id: parseInt(campaignId as string) as any })
      .then((response) => {
        setCampaign(response);
      })
      .catch((err) => console.error(err));
  }, [campaignId]);

  useEffect(() => {
    campaignsClient
      .get_donations_for_campaign({
        campaign_id: parseInt(campaignId as string) as any,
        limit: 999,
      })
      .then((response) => {
        setDonations(response);
      })
      .catch((err) => console.error(err));
  }, [campaignId]);

  return {
    donations,
    campaign,
  };
};
