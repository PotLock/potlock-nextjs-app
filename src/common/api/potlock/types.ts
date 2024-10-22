import { ListRegistration, Pot, PotApplication } from "./generated/client";

export * from "./generated/client";

export type PotId = Pot["account"];

export interface ByPotId {
  potId: PotId;
}

export {
  StatusF24Enum as ListRegistrationStatus,
  Status68eEnum as PotApplicationStatus,
} from "./generated/client";

export type ListRegistrationStatusString = ListRegistration["status"];
export type PotApplicationStatusString = PotApplication["status"];
