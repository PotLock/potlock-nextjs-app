import { MemoryCache } from "@wpdas/naxios";

import { naxiosInstance } from "@/common/api/near";
import { CAMPAIGN_CONTRACT_ID } from "@/common/constants";
import { floatToYoctoNear } from "@/common/lib";

import { Campaign, CampaignFormFields } from "./interfaces/campaign.interfaces";

export const contractApi = naxiosInstance.contractApi({
  contractId: CAMPAIGN_CONTRACT_ID,
  cache: new MemoryCache({ expirationTime: 10 }),
});

/**
 * CREATE CAMPAIGN
 */

export const create_campaign = ({ args }: { args: CampaignFormFields }) => {
  return contractApi.call("create_campaign", {
    args,
    deposit: floatToYoctoNear(0.021),
    gas: "300000000000000",
  });
};

/**
 * GET CAMPAIGNS
 */

export const get_campaigns = () =>
  contractApi.view<{}, Campaign[]>("get_campaigns");

/**
 * GET CAMPAIGN
 */

export interface GetCampaignInput {
  campaign_id: string;
}

export const get_campaign = (args: GetCampaignInput) =>
  contractApi.view<typeof args, Campaign>(`get_campaign`, { args });

export const get_donations_for_campaign = (args: GetCampaignInput) =>
  contractApi.view<typeof args, number>("get_donations_for_campaign", { args });
