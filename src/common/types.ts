import { Account } from "near-api-js";
import { SWRConfiguration } from "swr";

export type ClientConfig = { swr?: SWRConfiguration };

export interface ConditionalExecution {
  enabled?: boolean;
}

export type ContractMetadata = {
  latestSourceCodeCommitHash: null | string;
};

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

/**
 * `"{CONTRACT_ADDRESS}:{METHOD_NAME}"`
 */
export type ProviderId = string;
