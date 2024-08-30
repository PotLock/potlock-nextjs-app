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

export const NETWORK = (process.env.NEXT_PUBLIC_NETWORK?.toLowerCase() ||
  "testnet") as Network;

export const PAGODA_API_KEY = process.env.NEXT_PUBLIC_PAGODA_API_KEY as string;

export const POTLOCK_CONTRACT_VERSION = "0.1.0";
export const POTLOCK_CONTRACT_REPO_URL = "https://github.com/PotLock/core";

export const SYBIL_CONTRACT_ID =
  NETWORK === "mainnet" ? "v1.nadabot.near" : "v1.nadabot.testnet";

export const SYBIL_FRONTEND_URL =
  NETWORK === "mainnet" ? "https://app.nada.bot" : "https://testnet.nada.bot";

export const SOCIAL_DB_CONTRACT_ID =
  NETWORK === "mainnet" ? "social.near" : "v1.social08.testnet";

export const LISTS_CONTRACT_ID =
  NETWORK === "mainnet" ? "lists.potlock.near" : "lists.potlock.testnet";

export const DONATION_CONTRACT_ID =
  NETWORK === "mainnet" ? "donate.potlock.near" : "donate.potlock.testnet";

export const POT_FACTORY_CONTRACT_ID =
  NETWORK === "mainnet"
    ? "v1.potfactory.potlock.near"
    : "v1.potfactory.potlock.testnet";

// List ID of PotLock Public Goods Registry
export const POTLOCK_REGISTRY_LIST_ID = 1;

// Separates contract_id and method_name in ProviderId
export const PROVIDER_ID_DELIMITER = ":";

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
// 300 TGas (full)
export const FULL_TGAS = "300000000000000";
export const FIFTY_TGAS = "50000000000000";
// 0 Gas
export const NO_DEPOSIT_TGAS = "0";

export const MIN_PROPOSAL_DEPOSIT_FALLBACK = "100000000000000000000000"; // 0.1N

export const ONE_TGAS = Big(1_000_000_000_000);

// IPFS GATEWAY TO RENDER NEAR SOCIAL PROFILE IMAGE
export const IPFS_NEAR_SOCIAL_THUMBNAIL_URL =
  "https://i.near.social/thumbnail/https://ipfs.near.social/ipfs/";

export const IPFS_NEAR_SOCIAL_URL = "https://ipfs.near.social/ipfs/";

export const DEFAULT_URL = "https://app.potlock.org/";

export const SUPPORTED_FTS: Record<
  string,
  {
    iconUrl: string;
    toIndivisible: (amount: any) => Big.Big;
    fromIndivisible: (amount: any, decimals?: any) => string;
  }
> = {
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
