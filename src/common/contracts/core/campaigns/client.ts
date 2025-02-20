import { MemoryCache } from "@wpdas/naxios";

import { CAMPAIGNS_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { naxiosInstance } from "@/common/blockchains/near-protocol/client";
import { floatToYoctoNear } from "@/common/lib";
import { AccountId, ByCampaignId, CampaignId } from "@/common/types";

import {
  Campaign,
  CampaignDonation,
  CampaignFormFields,
  DirectCampaignDonationArgs,
} from "./interfaces";

const contractApi = naxiosInstance.contractApi({
  contractId: CAMPAIGNS_CONTRACT_ACCOUNT_ID,
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
 * PROCESS ESCROWED DONATIONS
 */

export const process_escrowed_donations_batch = ({
  args,
}: {
  args: { campaign_id: CampaignId };
}) => {
  return contractApi.call("process_escrowed_donations_batch", {
    args,
    gas: "300000000000000",
  });
};

/**
 * PROCESS DONATIONS REFUND
 */

export const process_refunds_batch = ({ args }: { args: { campaign_id: CampaignId } }) => {
  return contractApi.call("process_refunds_batch", {
    args,
    gas: "300000000000000",
  });
};

/**
 * UPDATE CAMPAIGN
 */

export const update_campaign = ({
  args,
}: {
  args: CampaignFormFields & { campaign_id: CampaignId };
}) => {
  return contractApi.call("update_campaign", {
    args,
    deposit: floatToYoctoNear(0.021),
    gas: "300000000000000",
  });
};

export const delete_campaign = ({ args }: { args: { campaign_id: CampaignId } }) => {
  return contractApi.call("delete_campaign", {
    args,
    deposit: floatToYoctoNear(0.021),
    gas: "300000000000000",
  });
};

export const donate = (args: DirectCampaignDonationArgs, depositAmountYocto: string) =>
  contractApi.call("donate", {
    args,
    deposit: depositAmountYocto,
    gas: "300000000000000",
    callbackUrl: window.location.href,
  });

export const get_campaigns = () => contractApi.view<{}, Campaign[]>("get_campaigns");

export type GetCampaignsByOwnerArgs = {
  owner_id: AccountId;
  from_index?: number | null;
  limit?: number | null;
};

export const get_campaigns_by_owner = (args: GetCampaignsByOwnerArgs) =>
  contractApi.view<typeof args, Campaign[]>("get_campaigns_by_owner", { args });

export type GetCampaignArgs = {
  campaign_id: number;
  from_index?: number | null;
  limit?: number | null;
};

export const get_campaign = (args: GetCampaignArgs) =>
  contractApi.view<typeof args, Campaign>("get_campaign", { args });

export const get_donations_for_campaign = (args: GetCampaignArgs) =>
  contractApi.view<typeof args, CampaignDonation[]>("get_donations_for_campaign", { args });

export const has_escrowed_donations_to_process = (args: GetCampaignArgs) =>
  contractApi.view<typeof args, Campaign>("has_escrowed_donations_to_process", { args });

export const can_process_refunds = (args: GetCampaignArgs) =>
  contractApi.view<typeof args, Campaign>("can_process_refunds", { args });
