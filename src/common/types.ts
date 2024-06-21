import { Account } from "near-api-js";

export type AccountId = Account["accountId"];

export interface ByAccountId {
  accountId: AccountId;
}
