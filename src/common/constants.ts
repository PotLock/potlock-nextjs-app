import { Network } from "@wpdas/naxios";
import Big from "big.js";
import { utils } from "near-api-js";

/**
 * Docs: https://dev.potlock.io/api/schema/swagger-ui/
 */
export const POTLOCK_API_ENDPOINT =
  "https://dev.potlock.io/api/v1" ?? "https://test-dev.potlock.io/api/v1";

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
export const POTLOCK_LISTS_CONTRACT_ID = process.env
  .NEXT_PUBLIC_POTLOCK_LISTS_CONTRACT_ID as string;

// POTLOCK DONATE CONTRACT
export const POTLOCK_DONATE_CONTRACT_ID = process.env
  .NEXT_PUBLIC_POTLOCK_DONATE_CONTRACT_ID as string;

// POTLOCK DONATE CONTRACT
export const POTLOCK_POT_FACTORY_CONTRACT_ID = process.env
  .NEXT_PUBLIC_POTLOCK_POT_FACTORY_CONTRACT_ID as string;

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

export const DEFAULT_URL = "https://app.potlock.org/";

export const SUPPORTED_FTS = {
  NEAR: {
    iconUrl:
      "https://nftstorage.link/ipfs/bafkreidnqlap4cp5o334lzbhgbabwr6yzkj6albia62l6ipjsasokjm6mi",
    toIndivisible: (amount: any) => new Big(amount).mul(new Big(10).pow(24)),
    fromIndivisible: (amount: any, decimals?: any) =>
      Big(amount)
        .div(Big(10).pow(24))
        .toFixed(decimals || 2),
  },
  USD: {
    iconUrl: "$",
    toIndivisible: (amount: any) => new Big(amount).mul(new Big(10).pow(24)),
    fromIndivisible: (amount: any, decimals: any) =>
      Big(amount)
        .div(Big(10).pow(24))
        .toFixed(decimals || 2),
  },
};
