import { Provider } from "near-api-js/lib/providers";

import { SYBIL_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { nearProtocolClient } from "@/common/api/near-protocol";
import { FULL_TGAS, ONE_HUNDREDTH_NEAR, TWO_HUNDREDTHS_NEAR } from "@/common/constants";
import { AccountId } from "@/common/types";

import {
  ActivateProviderInput,
  type Config,
  DeactivateProviderInput,
  FlagProviderInput,
  type GetHumanScoreInput,
  type GetStampsForAccountIdInput,
  type GetUsersForStampInput,
  type HumanScoreResponse,
  ProviderExternal,
  RegisterProviderInput,
  type StampExternal,
  UnflagProviderInput,
  UpdateProviderInput,
} from "./interfaces";

const contractApi = nearProtocolClient.naxiosInstance.contractApi({
  contractId: SYBIL_CONTRACT_ACCOUNT_ID,
});

export const get_config = () => contractApi.view<{}, Config>("get_config");

export const get_providers = () => contractApi.view<object, ProviderExternal[]>("get_providers");

export const get_stamps_for_account_id = (args: GetStampsForAccountIdInput) =>
  contractApi.view<typeof args, StampExternal[]>("get_stamps_for_account_id", { args });

export const get_users_for_stamp = (args: GetUsersForStampInput) =>
  contractApi.view<typeof args, AccountId[]>("get_users_for_stamp", { args });

export const get_human_score = (args: GetHumanScoreInput) =>
  contractApi.view<typeof args, HumanScoreResponse>("get_human_score", { args });

export const is_human = (args: GetHumanScoreInput): Promise<boolean> =>
  contractApi.view<typeof args, boolean>("is_human", { args });

/**
 * Anyone can call this method to register a provider. If caller is admin, provider is automatically activated.
 */
export const register_provider = (args: RegisterProviderInput) =>
  contractApi.call<typeof args, ProviderExternal>("register_provider", {
    args,
    gas: FULL_TGAS,
    deposit: ONE_HUNDREDTH_NEAR,
  });

export type AdminSetDefaultHumanThresholdArgs = {
  default_human_threshold: number;
};

export const admin_set_default_human_threshold = (args: AdminSetDefaultHumanThresholdArgs) =>
  contractApi.call<typeof args, void>("admin_set_default_human_threshold", {
    args,
    deposit: ONE_HUNDREDTH_NEAR,
  });

/**
 * Add Stamp
 *
 * Undefined response indicates that user is not verified on target provider
 * @param provider_id
 * @returns
 */
export const add_stamp = (providerId: string) =>
  contractApi.call<object, StampExternal | undefined>("add_stamp", {
    args: {
      provider_id: providerId,
    },
    gas: FULL_TGAS,
    deposit: TWO_HUNDREDTHS_NEAR,
    callbackUrl: `${window.location.href}?verifiedProvider=${providerId}`,
  });

/**
 * Update Provider - This method can only be called by the provider's original submitter, or sybil contract owner/admin.
 * @param args
 * @returns
 */
export const update_provider = (args: UpdateProviderInput) =>
  contractApi.call<typeof args, ProviderExternal>("update_provider", {
    args,
    deposit: ONE_HUNDREDTH_NEAR,
  });

export const admin_activate_provider = (args: ActivateProviderInput) =>
  contractApi.call<typeof args, Provider>("admin_activate_provider", {
    args,
    deposit: ONE_HUNDREDTH_NEAR,
  });

export const admin_deactivate_provider = (args: DeactivateProviderInput) =>
  contractApi.call<typeof args, Provider>("admin_deactivate_provider", {
    args,
    deposit: ONE_HUNDREDTH_NEAR,
  });

export const admin_flag_provider = (args: FlagProviderInput) =>
  contractApi.call<typeof args, Provider>("admin_flag_provider", { args });

export const admin_unflag_provider = (args: UnflagProviderInput) =>
  contractApi.call<typeof args, Provider>("admin_unflag_provider", { args });
