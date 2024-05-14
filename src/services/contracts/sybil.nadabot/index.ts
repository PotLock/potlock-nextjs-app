import { MemoryCache } from "@wpdas/naxios";
import { Provider } from "near-api-js/lib/providers";

import {
  FULL_TGAS,
  NADABOT_CONTRACT_ID,
  ONE_HUNDREDTH_NEAR,
  TWO_HUNDREDTHS_NEAR,
} from "@app/constants";

import { GetHumanScoreInput, HumanScoreResponse } from "./interfaces/is-human";
import { Config } from "./interfaces/lib";
import {
  ActivateProviderInput,
  DeactivateProviderInput,
  FlagProviderInput,
  ProviderExternal,
  RegisterProviderInput,
  UnflagProviderInput,
  UpdateProviderInput,
} from "./interfaces/providers";
import {
  AccountId,
  GetStampsForAccountIdInput,
  GetUsersForStampInput,
  StampExternal,
} from "./interfaces/stamps";
import { naxiosInstance } from "..";

/**
 * NEAR Contract API
 */
export const contractApi = naxiosInstance.contractApi({
  contractId: NADABOT_CONTRACT_ID,
  cache: new MemoryCache({ expirationTime: 10 }), // 10 seg
});

// READ METHODS

/**
 * Get Config
 */
export const get_config = () => contractApi.view<{}, Config>("get_config");

/**
 * Get Providers
 * @returns
 */
export const get_providers = () =>
  contractApi.view<object, ProviderExternal[]>("get_providers", undefined, {
    useCache: true,
  });

/**
 * Get Stamps for Account Id
 * @returns
 */
export const get_stamps_for_account_id = (args: GetStampsForAccountIdInput) =>
  contractApi.view<typeof args, StampExternal[]>(
    "get_stamps_for_account_id",
    {
      args,
    },
    { useCache: true },
  );

/**
 * Get Users for Stamps
 * @returns
 */
export const get_users_for_stamp = (args: GetUsersForStampInput) =>
  contractApi.view<typeof args, AccountId[]>("get_users_for_stamp", {
    args,
  });

/**
 * Get Human Score
 * @returns
 */
export const get_human_score = (args: GetHumanScoreInput) =>
  contractApi.view<typeof args, HumanScoreResponse>("get_human_score", {
    args,
  });

// WRITE METHODS
/**
 * Anyone can call this method to register a provider. If caller is admin, provider is automatically activated.
 */
export const register_provider = (args: RegisterProviderInput) =>
  contractApi.call<typeof args, ProviderExternal>("register_provider", {
    args,
    gas: FULL_TGAS,
    deposit: ONE_HUNDREDTH_NEAR,
  });

/**
 * Set default human threshold
 * @param default_human_threshold
 * @returns
 */
export const admin_set_default_human_threshold = (
  default_human_threshold: number,
) =>
  contractApi.call("admin_set_default_human_threshold", {
    args: {
      default_human_threshold,
    },
    deposit: ONE_HUNDREDTH_NEAR,
  });

/**
 * Add Stamp
 *
 * Undefined response indicates that user is not verified on target provider
 * @param provider_id
 * @returns
 */
export const add_stamp = (provider_id: string) =>
  contractApi.call<object, StampExternal | undefined>("add_stamp", {
    args: {
      provider_id,
    },
    gas: FULL_TGAS,
    deposit: TWO_HUNDREDTHS_NEAR,
    callbackUrl: `${window.location.href}?verifiedProvider=${provider_id}`,
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

/**
 * Activate Provider
 * @param args
 * @returns
 */
export const admin_activate_provider = (args: ActivateProviderInput) =>
  contractApi.call<typeof args, Provider>("admin_activate_provider", {
    args,
    deposit: ONE_HUNDREDTH_NEAR,
  });

/**
 * Deactivate Provider
 * @param args
 * @returns
 */
export const admin_deactivate_provider = (args: DeactivateProviderInput) =>
  contractApi.call<typeof args, Provider>("admin_deactivate_provider", {
    args,
    deposit: ONE_HUNDREDTH_NEAR,
  });

/**
 * Flag Provider
 * @param args
 * @returns
 */
export const admin_flag_provider = (args: FlagProviderInput) =>
  contractApi.call<typeof args, Provider>("admin_flag_provider", {
    args,
  });

/**
 * Unflag Provider
 * @param args
 * @returns
 */
export const admin_unflag_provider = (args: UnflagProviderInput) =>
  contractApi.call<typeof args, Provider>("admin_unflag_provider", {
    args,
  });
