import { MemoryCache } from "@wpdas/naxios";

import { naxiosInstance } from "@/common/api/near";
import { CAMPAIGN_CONTRACT_ID } from "@/common/constants";
import { floatToYoctoNear } from "@/common/lib";

import { CampaignFormFields } from "./interfaces/campaign.interfaces";

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
