/**
 *! Heads up! Types defined here can ONLY use external dependencies!
 */

import { Network } from "@wpdas/naxios";
import { Account } from "near-api-js";
import { SWRConfiguration } from "swr";

export enum FeatureId {
  /**
   * Donation to a single account using fungible token.
   */
  DirectFtDonation = "DirectFtDonation",

  /**
   * Donation to a single account using blockchain's native token.
   */
  DirectNativeTokenDonation = "DirectNativeTokenDonation",
}

export type FeatureFlags = { isEnabled: boolean };

export type Feature = FeatureFlags & {
  id: FeatureId;
  name: string;
};

export type FeatureRegistry = Record<FeatureId, Feature>;

export type AccountId = Account["accountId"];

export interface ByAccountId {
  accountId: AccountId;
}

export type ContractConfig = ByAccountId & {};

export type EnvConfig = {
  network: Network;
  contractMetadata: { version: string; repoUrl: string };
  indexer: { api: { endpointUrl: string } };
  features: FeatureRegistry;

  deFi: {
    refFinance: {
      exchangeContract: ContractConfig;
    };
  };

  campaigns: { contract: { accountId: string } };
  donation: { contract: ContractConfig };
  lists: { contract: ContractConfig };
  potFactory: { contract: ContractConfig };
  sybil: { app: { url: string }; contract: ContractConfig };
  social: { app: { url: string }; contract: ContractConfig };
};

export type { infer as FromSchema } from "zod";

export type UnionFromStringList<ListOfMembers extends string[]> = ListOfMembers[number];

export type ClientConfig = { swr?: SWRConfiguration };

export interface ConditionalExecution {
  enabled?: boolean;
}

export type ContractMetadata = {
  latestSourceCodeCommitHash: null | string;
};

export interface ByStringId {
  id: string;
}

/**
 * Either "NEAR" or FT contract account id.
 */
export type TokenId = "near" | AccountId;

export interface ByTokenId {
  tokenId: TokenId;
}

export type ListId = number;

export interface ByListId {
  listId: ListId;
}

export type CampaignId = number;
export interface ByCampaignId {
  campaignId: CampaignId;
}

/**
 * `"{CONTRACT_ADDRESS}:{METHOD_NAME}"`
 */
export type ProviderId = string;

export interface ByRegistrationId {
  registrationId: number;
}

export type TxExecutionStatus =
  | "NONE"
  | "INCLUDED"
  | "EXECUTED_OPTIMISTIC"
  | "INCLUDED_FINAL"
  | "EXECUTED"
  | "FINAL";

export type FungibleTokenMetadata = {
  spec: string;
  name: string;
  symbol: string;
  icon: string | null;
  reference: string | null;
  reference_hash: string | null;
  decimals: number;
};

export enum ChronologicalSortOrder {
  recent = "recent",
  older = "older",
}

export type ChronologicalSortOrderVariant = keyof typeof ChronologicalSortOrder;

export type BasicRequirement = { title: string; isSatisfied: boolean };
