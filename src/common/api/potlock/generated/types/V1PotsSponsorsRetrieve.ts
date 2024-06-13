import type { Account } from "./Account";

export type V1PotsSponsorsRetrievePathParams = {
  /**
   * @type string
   */
  pot_id: string;
};
/**
 * @description Returns sponsors for the pot
 */
export type V1PotsSponsorsRetrieve200 = Account[];
/**
 * @description Pot not found
 */
export type V1PotsSponsorsRetrieve404 = any;
/**
 * @description Returns sponsors for the pot
 */
export type V1PotsSponsorsRetrieveQueryResponse = Account[];
export type V1PotsSponsorsRetrieveQuery = {
  Response: V1PotsSponsorsRetrieveQueryResponse;
  PathParams: V1PotsSponsorsRetrievePathParams;
  Errors: V1PotsSponsorsRetrieve404;
};
