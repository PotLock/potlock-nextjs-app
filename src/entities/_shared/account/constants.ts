import { RegistrationStatus } from "@/common/contracts/core/lists";

import {
  type AccountCategoryOption,
  type AccountCategoryVariant,
  type AccountListRegistrationStatusOption,
  type AccountProfileLinktreeKey,
} from "./types";

export const ACCOUNT_PROFILE_DESCRIPTION_MAX_LENGTH = 1500;

// export const ACCOUNT_PROFILE_IMAGE_PLACEHOLDER_SRC = `${IMAGES_ASSET_ENDPOINT_URL}/profile-image.jpg`;

export const ACCOUNT_PROFILE_IMAGE_PLACEHOLDER_SRC =
  "https://potlock.mypinata.cloud/ipfs/bafkreidmfead5arjheqrsvarqfqhofwwlguw2kb5rlhgcmvdd4d7wkh43u";

// export const ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC = `${IMAGES_ASSET_ENDPOINT_URL}/profile-banner.png`;

export const ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC =
  "https://potlock.mypinata.cloud/ipfs/bafkreidcescdtqwteqtqtoluujf6z52cbmphjrd6bghxa6667n4djkznqa";

export const ACCOUNT_PROFILE_LINKTREE_KEYS: AccountProfileLinktreeKey[] = [
  "github",
  "telegram",
  "twitter",
  "website",
];

export const ACCOUNT_PROFILE_URL_PATTERNS: Record<AccountProfileLinktreeKey, RegExp> = {
  github: /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+(?:\/[^/]+)?)\/?$/,
  twitter: /^(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/([^/]+(?:\/[^/]+)?)\/?$/,
  telegram: /^(?:https?:\/\/)?(?:www\.)?t\.me\/([^/]+(?:\/[^/]+)?)\/?$/,
  website: /^(?:https?:\/\/)?([^/]+)$/,
};

export const ACCOUNT_CATEGORY_VARIANTS: AccountCategoryVariant[] = [
  "Social Impact",
  "Non Profit",
  "Climate",
  "Public Good",
  "DeSci",
  "Open Source",
  "Community",
  "Education",
];

export const ACCOUNT_CATEGORY_OPTIONS: AccountCategoryOption[] = [
  { label: "DeSci", val: "DeSci" },
  { label: "Open Source", val: "Open Source" },
  { label: "Non Profit", val: "Non Profit" },
  { label: "Social Impact", val: "Social Impact" },
  { label: "Climate", val: "Climate" },
  { label: "Public Good", val: "Public Good" },
  { label: "Community", val: "Community" },
  { label: "Education", val: "Education" },
];

export const ACCOUNT_REGISTRATION_STATUSES: Record<
  RegistrationStatus | "Unregistered",
  {
    background: string;
    text: string;
    textColor: string;
    toggleColor: string;
  }
> = {
  Approved: {
    background: "",
    text: "",
    textColor: "",
    toggleColor: "",
  },

  Graylisted: {
    background: "#C7C7C7",
    text: "GRAYLISTED: needs further review, unsure if project qualifies on public goods",
    textColor: "#525252",
    toggleColor: "#FFFFFF",
  },

  Rejected: {
    background: "#DD3345",
    text: "REJECTED: this project was denied on public goods registry",
    textColor: "#FEF6EE",
    toggleColor: "#C7C7C7",
  },

  Pending: {
    background: "#F0CF1F",
    text: "PENDING: this project has yet to be approved",
    textColor: "#292929",
    toggleColor: "#7B7B7B",
  },

  Blacklisted: {
    background: "#292929",
    text: "BLACKLISTED:  this project has been removed for violating terms",
    textColor: "#F6F5F3",
    toggleColor: "#C7C7C7",
  },

  Unregistered: {
    background: "#DD3345",
    text: "UNREGISTERED: This account has not registered as a public good",
    textColor: "#F6F5F3",
    toggleColor: "#C7C7C7",
  },
};

export const ACCOUNT_LIST_REGISTRATION_STATUS_OPTIONS: AccountListRegistrationStatusOption[] = [
  { label: "All", val: "All" },
  { label: "Approved", val: "Approved" },
  { label: "Pending", val: "Pending" },
  { label: "Rejected", val: "Rejected" },
  { label: "Graylisted", val: "Graylisted" },
  { label: "Blacklisted", val: "Blacklisted" },
];
