import { MemoryCache } from "@wpdas/naxios";
import { Provider } from "near-api-js/lib/providers";

import { SYBIL_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { naxiosInstance } from "@/common/api/near";
import {
  FULL_TGAS,
  ONE_HUNDREDTH_NEAR,
  TWO_HUNDREDTHS_NEAR,
} from "@/common/constants";

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

/**
 * NEAR Contract API
 */
export const contractApi = naxiosInstance.contractApi({
  contractId: SYBIL_CONTRACT_ACCOUNT_ID,
  cache: new MemoryCache({ expirationTime: 10 }), // 10 seg
});

// READ METHODS

/**
 * Get Config
 */
export const getConfig = () => contractApi.view<{}, Config>("get_config");

/**
 * Get Providers
 * @returns
 */
export const getProviders = () =>
  contractApi.view<object, ProviderExternal[]>("get_providers", undefined, {
    useCache: true,
  });

/**
 * Get Stamps for Account Id
 * @returns
 */
export const getStampsForAccountId = (args: GetStampsForAccountIdInput) =>
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
export const getUsersForStamp = (args: GetUsersForStampInput) =>
  contractApi.view<typeof args, AccountId[]>("get_users_for_stamp", {
    args,
  });

/**
 * Get Human Score
 * @returns
 */
export const getHumanScore = (args: GetHumanScoreInput) =>
  contractApi.view<typeof args, HumanScoreResponse>("get_human_score", {
    args,
  });

/**
 * Get if address is human
 * @returns
 */
export const getIsHuman = (args: GetHumanScoreInput): Promise<boolean> =>
  contractApi.view<typeof args, boolean>("is_human", {
    args,
  });

// WRITE METHODS
/**
 * Anyone can call this method to register a provider. If caller is admin, provider is automatically activated.
 */
export const registerProvider = (args: RegisterProviderInput) =>
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
export const adminSetDefaultHumanThreshold = (defaultHumanThreshold: number) =>
  contractApi.call("admin_set_default_human_threshold", {
    args: {
      default_human_threshold: defaultHumanThreshold,
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
export const addStamp = (providerId: string) =>
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
export const updateProvider = (args: UpdateProviderInput) =>
  contractApi.call<typeof args, ProviderExternal>("update_provider", {
    args,
    deposit: ONE_HUNDREDTH_NEAR,
  });

/**
 * Activate Provider
 * @param args
 * @returns
 */
export const adminActivateProvider = (args: ActivateProviderInput) =>
  contractApi.call<typeof args, Provider>("admin_activate_provider", {
    args,
    deposit: ONE_HUNDREDTH_NEAR,
  });

/**
 * Deactivate Provider
 * @param args
 * @returns
 */
export const adminDeactivateProvider = (args: DeactivateProviderInput) =>
  contractApi.call<typeof args, Provider>("admin_deactivate_provider", {
    args,
    deposit: ONE_HUNDREDTH_NEAR,
  });

/**
 * Flag Provider
 * @param args
 * @returns
 */
export const adminFlagProvider = (args: FlagProviderInput) =>
  contractApi.call<typeof args, Provider>("admin_flag_provider", {
    args,
  });

/**
 * Unflag Provider
 * @param args
 * @returns
 */
export const adminUnflagProvider = (args: UnflagProviderInput) =>
  contractApi.call<typeof args, Provider>("admin_unflag_provider", {
    args,
  });
