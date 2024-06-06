import { Network } from "@wpdas/naxios";
import { utils } from "near-api-js";

/**
 * Docs: https://dev.potlock.io/api/schema/swagger-ui/
 */
export const POTLOCK_API_ENDPOINT =
  "https://dev.potlock.io" ?? "https://test-dev.potlock.io";

export const REQUEST_CONFIG = {
  client: { baseURL: POTLOCK_API_ENDPOINT },
};

// NETWORK
export const NETWORK = (process.env.NEXT_PUBLIC_NETWORK ||
  "testnet") as Network;

// SYBIL CONTRACT
export const NADABOT_CONTRACT_ID = process.env
  .NEXT_PUBLIC_NADABOT_CONTRACT_ID as string;

// SOCIAL DB CONTRACT
export const SOCIAL_DB_CONTRACT_ID = process.env
  .NEXT_PUBLIC_SOCIAL_DB_CONTRACT_ID as string;

// POTLOCK LISTS CONTRACT
export const POTLOCK_LISTS_CONTRACT_ID = "lists.potlock.near";

// POTLOCK DONATE CONTRACT
export const POTLOCK_DONATE_CONTRACT_ID = "donate.potlock.near";

// POTLOCK DONATE CONTRACT
export const POTLOCK_POT_FACTORY_CONTRACT_ID = "v1.potfactory.potlock.near";

// POTLOCK REGISTRY LIST ID
export const POTLOCK_REGISTRY_LIST_ID = 1;

// 1 NEAR
export const ONE_NEAR = utils.format.parseNearAmount("1")!;
// 0.5 NEAR
export const HALF_NEAR = utils.format.parseNearAmount("0.5")!;
// 0.1 NEAR
export const ONE_TENTH_NEAR = utils.format.parseNearAmount("0.1")!;
// 0.01 NEAR
export const ONE_HUNDREDTH_NEAR = utils.format.parseNearAmount("0.01")!;
// 0.02 NEAR
export const TWO_HUNDREDTHS_NEAR = utils.format.parseNearAmount("0.02")!;
// 300 Gas (full)
export const FULL_TGAS = "300000000000000";
// 0 Gas
export const NO_DEPOSIT_TGAS = "0";

// IPFS GATEWAY TO RENDER NEAR SOCIAL PROFILE IMAGE
export const IPFS_NEAR_SOCIAL_THUMBNAIL_URL =
  "https://i.near.social/thumbnail/https://ipfs.near.social/ipfs/";
