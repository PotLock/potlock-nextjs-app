import { Account } from "near-api-js";

export interface ConditionalExecution {
  enabled: boolean;
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
