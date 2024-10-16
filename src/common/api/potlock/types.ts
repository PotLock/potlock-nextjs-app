import { Pot } from "./generated/client";

export * from "./generated/client";

export type PotId = Pot["account"];

export interface ByPotId {
  potId: PotId;
}

export { Status68eEnum as PotApplicationStatus } from "./generated/client";
