import { Account, Pot } from "./generated/client";

export * from "./generated/client";

export type AccountId = Account["id"];

export interface ByAccountId {
  accountId: AccountId;
}

export type PotId = Pot["id"];

export interface ByPotId {
  potId: PotId;
}
