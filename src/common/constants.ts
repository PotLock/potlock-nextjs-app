import { Big } from "big.js";
import { utils } from "near-api-js";
import { Metadata } from "next";

export const DEBUG = Boolean(process.env.NEXT_PUBLIC_DEBUG);
export const PAGODA_API_KEY = process.env.NEXT_PUBLIC_PAGODA_API_KEY as string;
export const ICONS_ASSET_ENDPOINT_URL = "/assets/icons";
export const IMAGES_ASSET_ENDPOINT_URL = "/assets/images";

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

// List ID of PotLock Public Goods Registry
export const POTLOCK_REGISTRY_LIST_ID = 1;

// Separates contract_id and method_name in ProviderId
export const PROVIDER_ID_DELIMITER = ":";

export const NEAR_TOKEN_DENOM = "near";
export const NEAR_DEFAULT_TOKEN_DECIMALS = 24;
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
