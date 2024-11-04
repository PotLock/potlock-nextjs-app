import { useEffect, useState } from "react";

import { Campaign, CampaignDonation } from "@/common/contracts/potlock";
import {
  get_campaign,
  get_donations_for_campaign,
} from "@/common/contracts/potlock/campaigns";

export const useCampaign = ({ campaignId }: { campaignId: string }) => {
  const [campaign, setCampaign] = useState<Campaign>();
  const [donations, setDonations] = useState<CampaignDonation[]>([]);

  useEffect(() => {
    get_campaign({ campaign_id: parseInt(campaignId as string) as any })
      .then((response) => {
        setCampaign(response);
      })
      .catch((err) => console.error(err));
  }, [campaignId]);

  useEffect(() => {
    get_donations_for_campaign({
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
