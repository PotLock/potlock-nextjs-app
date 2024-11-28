import { ListRegistration, Pot, PotApplication } from "./internal/client.generated";

/**
 *! Heads Up!
 *!  This won't reexport enums as well as object mappings, make manual reexports below if needed.
 */
export type * from "./internal/client.generated";

export type PotId = Pot["account"];

export interface ByPotId {
  potId: PotId;
}

export {
  StatusF24Enum as ListRegistrationStatus,
  Status68eEnum as PotApplicationStatus,
} from "./internal/client.generated";

export type ListRegistrationStatusString = ListRegistration["status"];
export type PotApplicationStatusString = PotApplication["status"];
