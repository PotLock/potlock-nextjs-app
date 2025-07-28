import { Transaction, buildTransaction, calculateDepositByDataSize } from "@wpdas/naxios";
import Big from "big.js";

import {
  CAMPAIGNS_CONTRACT_ACCOUNT_ID,
  LISTS_CONTRACT_ACCOUNT_ID,
  SOCIAL_DB_CONTRACT_ACCOUNT_ID,
} from "@/common/_config";
import { naxiosInstance } from "@/common/blockchains/near-protocol/client";
import { FULL_TGAS, PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { floatToYoctoNear, parseNearAmount } from "@/common/lib";
import { AccountId, CampaignId, type IndivisibleUnits } from "@/common/types";
import { ACCOUNT_PROFILE_IMAGE_PLACEHOLDER_SRC } from "@/entities/_shared/account";
import { profileConfigurationInputsToSocialDbFormat } from "@/features/profile-configuration/utils/normalization";

import {
  Campaign,
  CampaignDonation,
  CampaignDonationArgs,
  CampaignInputs,
  CampaignsContractConfig,
} from "./interfaces";
import { NEARSocialUserProfile } from "../../social-db";

const contractApi = naxiosInstance.contractApi({
  contractId: CAMPAIGNS_CONTRACT_ACCOUNT_ID,
});

export const get_config = () => contractApi.view<{}, CampaignsContractConfig>("get_config");

export type CreateCampaignParams = { args: CampaignInputs };

export const create_campaign = ({ args }: CreateCampaignParams) => {
  // If the project name is provided, we need to create a social profile for the project
  if (args.project_name && args.recipient === args.owner) {
    const { project_name, project_description, ...rest } = args;

    const socialArgs: NEARSocialUserProfile = profileConfigurationInputsToSocialDbFormat({
      name: project_name,
      description: project_description ?? "",
      categories: [], // Default category for new projects
      profileImage: ACCOUNT_PROFILE_IMAGE_PLACEHOLDER_SRC,
    });

    const depositFloat = Big(calculateDepositByDataSize(socialArgs)).add(0.1).toString();

    const socialTransaction = buildTransaction("set", {
      receiverId: SOCIAL_DB_CONTRACT_ACCOUNT_ID,
      args: {
        data: {
          [args.owner as AccountId]: {
            profile: socialArgs,
          },
        },
      },
      deposit: parseNearAmount(depositFloat)!,
    });

    const transactions: Transaction<object>[] = [socialTransaction];

    transactions.push(
      buildTransaction("register_batch", {
        receiverId: LISTS_CONTRACT_ACCOUNT_ID,
        args: { list_id: PUBLIC_GOODS_REGISTRY_LIST_ID },
        deposit: parseNearAmount("0.05")!,
        gas: FULL_TGAS,
      }),
    );

    transactions.push(
      buildTransaction("create_campaign", {
        args: rest,
        deposit: floatToYoctoNear(0.021),
        gas: FULL_TGAS,
      }),
    );

    return contractApi.callMultiple(transactions);
  } else {
    return contractApi.call<CreateCampaignParams["args"], Campaign>("create_campaign", {
      args,
      deposit: floatToYoctoNear(0.021),
      gas: FULL_TGAS,
    });
  }
};

export const process_escrowed_donations_batch = ({ args }: { args: { campaign_id: CampaignId } }) =>
  contractApi.call("process_escrowed_donations_batch", {
    args,
    gas: FULL_TGAS,
  });

export const process_refunds_batch = ({ args }: { args: { campaign_id: CampaignId } }) =>
  contractApi.call("process_refunds_batch", {
    args,
    gas: FULL_TGAS,
  });

export type UpdateCampaignParams = { args: CampaignInputs & { campaign_id: CampaignId } };

export const update_campaign = ({ args }: UpdateCampaignParams) =>
  contractApi.call<UpdateCampaignParams["args"], Campaign>("update_campaign", {
    args,
    deposit: floatToYoctoNear(0.021),
    gas: FULL_TGAS,
  });

export type DeleteCampaignParams = { args: { campaign_id: CampaignId } };

export const delete_campaign = ({ args }: DeleteCampaignParams) =>
  contractApi.call<DeleteCampaignParams["args"], void>("delete_campaign", {
    args,
    deposit: floatToYoctoNear(0.021),
    gas: FULL_TGAS,
  });

export const donate = (args: CampaignDonationArgs, depositAmountYocto: IndivisibleUnits) =>
  contractApi.call<CampaignDonationArgs, CampaignDonation>("donate", {
    args,
    deposit: depositAmountYocto,
    gas: FULL_TGAS,
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

export const storage_deposit = (depositAmountYocto: IndivisibleUnits) =>
  contractApi.call<{}, IndivisibleUnits>("storage_deposit", {
    deposit: depositAmountYocto,
    args: {},
    gas: "100000000000000",
  });
