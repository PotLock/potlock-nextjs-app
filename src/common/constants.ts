import { Big } from "big.js";
import { utils } from "near-api-js";
import { NEAR_NOMINATION_EXP } from "near-api-js/lib/utils/format";
import { Metadata } from "next";

import { NETWORK, PLATFORM_NAME } from "./_config";
import { ChronologicalSortOrderVariant, type TokenId } from "./types";

export const IS_CLIENT = typeof window !== "undefined";

export const DEBUG = process.env.NEXT_PUBLIC_DEBUG === "true" ? true : false;

/**
 * Unlocks authorization, useful for validation and permission control testing
 */
export const IS_UNDER_INSPECTION =
  process.env.NEXT_PUBLIC_IS_UNDER_INSPECTION === "true" ? true : false;

export const ICONS_ASSET_ENDPOINT_URL = "/assets/icons";
export const IMAGES_ASSET_ENDPOINT_URL = "/assets/images";
export const PLATFORM_TWITTER_ACCOUNT_ID = "PotLock_";
export const DEFAULT_SHARE_HASHTAGS = ["PublicGoods", "Donations"];
export const APP_DEFAULT_PUBLIC_URL = "https://alpha.potlock.org";
export const APP_BOS_COUNTERPART_URL = "https://bos.potlock.org";

export const APP_METADATA: Metadata & {
  title: string;
  description: NonNullable<Metadata["description"]>;
  manifest: NonNullable<Metadata["manifest"]>;

  openGraph: {
    url: NonNullable<Metadata["openGraph"]>["url"];
    type: "website";
    images: { url: string };
  };
  twitter: {
    card: string;
    creator: string;
    site: string;
  };
} = {
  title: PLATFORM_NAME,
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

  twitter: {
    site: "@PotLock_",
    creator: "@PotLock_",
    card: "summary_large_image",
  },
};

export const CHAIN_OPTIONS: Record<string, { isEVM: boolean }> = {
  NEAR: { isEVM: false },
  Solana: { isEVM: false },
  Ethereum: { isEVM: true },
  Polygon: { isEVM: true },
  Avalanche: { isEVM: true },
  Optimism: { isEVM: true },
  Arbitrum: { isEVM: true },
  BNB: { isEVM: true },
  Sui: { isEVM: false },
  Aptos: { isEVM: false },
  Polkadot: { isEVM: false },
  Stellar: { isEVM: false },

  // Note: ZkSync aims for EVM compatibility but might not fully be considered as traditional EVM
  // at the time of writing.
  ZkSync: { isEVM: false },

  Celo: { isEVM: true },
  Aurora: { isEVM: true },
  Injective: { isEVM: true },
  Base: { isEVM: false },

  // Listed twice in the original list; included once here.
  Manta: { isEVM: false },

  Fantom: { isEVM: true },
  ZkEVM: { isEVM: true },
  Flow: { isEVM: false },
  Tron: { isEVM: true },

  // Formerly known as Elrond, not traditionally EVM but has some level of compatibility.
  MultiverseX: { isEVM: false },

  // Assuming EVM compatibility based on the context of ZkEVM.
  Scroll: { isEVM: true },

  // Assuming non-EVM due to lack of information.
  Linea: { isEVM: true },
  Metis: { isEVM: true },
};

export const TOTAL_FEE_BASIS_POINTS = 10_000;
export const TOP_LEVEL_ROOT_ACCOUNT_ID = NETWORK === "mainnet" ? "near" : "testnet";
export const NATIVE_TOKEN_ID = "near";
export const NATIVE_TOKEN_DECIMALS = NEAR_NOMINATION_EXP;
export const NATIVE_TOKEN_ICON_URL = `${ICONS_ASSET_ENDPOINT_URL}/near.svg`;
export const UNKNOWN_ACCOUNT_ID_PLACEHOLDER = "unknown-account-id";

export const PLATFORM_LISTED_TOKEN_IDS: TokenId[] = [];

// List ID of PotLock Public Goods Registry
export const PUBLIC_GOODS_REGISTRY_LIST_ID = 1;

// Separates contract_id and method_name in ProviderId
export const PROVIDER_ID_DELIMITER = ":";

export const ONE_NEAR = utils.format.parseNearAmount("1")!;
export const HALF_NEAR = utils.format.parseNearAmount("0.5")!;
export const ONE_TENTH_NEAR = utils.format.parseNearAmount("0.1")!;
export const ONE_HUNDREDTH_NEAR = utils.format.parseNearAmount("0.01")!;
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
export const ETHEREUM_EXPLORER_ADDRESS_ENDPOINT_URL = "https://etherscan.io/address";

export const CHRONOLOGICAL_SORT_OPTIONS: {
  label: string;
  value: ChronologicalSortOrderVariant;
}[] = [
  { label: "Most recent", value: "recent" },
  { label: "Least recent", value: "older" },
];

/**
 * @deprecated Use `useTokenAllowlist` hooks instead
 */
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
