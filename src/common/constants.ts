import { Network } from "@wpdas/naxios";
import { AxiosRequestConfig } from "axios";
import Big from "big.js";
import { utils } from "near-api-js";
import { Metadata } from "next";

export const APP_METADATA: Metadata & {
  title: string;
  description: NonNullable<Metadata["description"]>;
  manifest: NonNullable<Metadata["manifest"]>;

  openGraph: {
    url: NonNullable<Metadata["openGraph"]>["url"];
    type: "website";
    images: { url: string };
  };
} = {
  title: "Potlock",
  description: "Bringing public goods funding to the table, built on NEAR",
  manifest: "/manifest.json",

  icons: {
    icon: "/favicon.png",
    apple: "/logo.png",
  },

  // Facebook Meta / Twitter Tags
  openGraph: {
    url: "https://bos.potlock.org/?tab=project&projectId=opact.near",
    type: "website",

    images: {
      url: "https://bos.potlock.org/preview.png",
    },
  },
};

export const RPC_NODE_URL = "https://free.rpc.fastnear.com";

// NETWORK
export const NETWORK = (process.env.NEXT_PUBLIC_NETWORK ||
  "testnet") as Network;

/**
 * Docs: https://dev.potlock.io/api/schema/swagger-ui/
 */
export const POTLOCK_API_ENDPOINT =
  NETWORK === "mainnet"
    ? "https://dev.potlock.io"
    : "https://test-dev.potlock.io";

/**
 * Request config for SWR
 */
export const POTLOCK_REQUEST_CONFIG: Record<"axios", AxiosRequestConfig> = {
  axios: { baseURL: POTLOCK_API_ENDPOINT },
};

/**
 * Docs: https://console.pagoda.co/apis?tab=enhancedApi#/
 */
export const PAGODA_API_ENDPOINT =
  NETWORK === "mainnet"
    ? "https://near-mainnet.api.pagoda.co/eapi/v1/"
    : "https://near-testnet.api.pagoda.co/eapi/v1/";

export const PAGODA_API_KEY = process.env.NEXT_PUBLIC_PAGODA_API_KEY as string;

/**
 * Request config for SWR
 */
export const PAGODA_REQUEST_CONFIG: Record<"axios", AxiosRequestConfig> = {
  axios: {
    baseURL: PAGODA_API_ENDPOINT,

    headers: {
      "Content-Type": "application/json",
      "x-api-key": PAGODA_API_KEY,
    },
  },
};

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

// Separates contract_id and method_name in ProviderId
export const PROVIDER_ID_DELIMITER = ":" as const;

export const NEAR_TOKEN_DENOM = "near";

export const NEAR_DEFAULT_TOKEN_DECIMALS = 24;

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
export const FIFTY_TGAS = "50000000000000";
// 0 Gas
export const NO_DEPOSIT_TGAS = "0";

// IPFS GATEWAY TO RENDER NEAR SOCIAL PROFILE IMAGE
export const IPFS_NEAR_SOCIAL_THUMBNAIL_URL =
  "https://i.near.social/thumbnail/https://ipfs.near.social/ipfs/";

export const IPFS_NEAR_SOCIAL_URL = "https://ipfs.near.social/ipfs/";

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
