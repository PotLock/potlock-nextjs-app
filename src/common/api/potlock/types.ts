import { Pot } from "./generated/client";

export * from "./generated/client";

export type PotId = Pot["id"];

export interface ByPotId {
  potId: PotId;
}
