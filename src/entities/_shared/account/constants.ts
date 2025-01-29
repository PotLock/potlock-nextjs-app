import { IMAGES_ASSET_ENDPOINT_URL } from "@/common/constants";
import { RegistrationStatus } from "@/common/contracts/core/lists";

import type { AccountProfileLinktreeKey } from "./types";

export const ACCOUNT_PROFILE_IMAGE_PLACEHOLDER_SRC = `${IMAGES_ASSET_ENDPOINT_URL}/profile-image.png`;

export const ACCOUNT_PROFILE_COVER_IMAGE_PLACEHOLDER_SRC = `${IMAGES_ASSET_ENDPOINT_URL}/profile-banner.png`;

export const ACCOUNT_PROFILE_LINKTREE_KEYS: AccountProfileLinktreeKey[] = [
  "github",
  "telegram",
  "twitter",
  "website",
];

export const ACCOUNT_PROFILE_URL_PATTERNS: Record<AccountProfileLinktreeKey, RegExp> = {
  github: /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+(?:\/[^/]+)?)\/?$/,
  twitter: /^(?:https?:\/\/)?(?:www\.)?x\.com\/([^/]+(?:\/[^/]+)?)\/?$/,
  telegram: /^(?:https?:\/\/)?(?:www\.)?t\.com\/([^/]+(?:\/[^/]+)?)\/?$/,
  website: /^(?:https?:\/\/)\/?$/,
};

export const ACCOUNT_REGISTRATION_STATUSES: Record<
  RegistrationStatus,
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
