/**
 *! Heads up! Types defined here can ONLY use external dependencies!
 */

import { Network } from "@wpdas/naxios";
import { Account } from "near-api-js";
import { SWRConfiguration } from "swr";

export type EnvConfig = {
  network: Network;
  contractMetadata: { version: string; repoUrl: string };
  donation: { contract: { accountId: string } };
  lists: { contract: { accountId: string } };
  campaigns: { contract: { accountId: string } };
  potFactory: { contract: { accountId: string } };
  sybil: { app: { url: string }; contract: { accountId: string } };
  social: { app: { url: string }; contract: { accountId: string } };
  indexer: { api: { endpointUrl: string } };
};

export type { infer as FromSchema } from "zod";

export type UnionFromStringList<ListOfMembers extends string[]> =
  ListOfMembers[number];

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

export type AccountId = Account["accountId"];

export interface ByAccountId {
  accountId: AccountId;
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
