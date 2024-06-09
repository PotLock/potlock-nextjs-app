import type { Pot } from "./Pot";

/**
 * @description Returns a list of pots
 */
export type V1PotsRetrieve200 = Pot[];
/**
 * @description Returns a list of pots
 */
export type V1PotsRetrieveQueryResponse = Pot[];
export type V1PotsRetrieveQuery = {
  Response: V1PotsRetrieveQueryResponse;
};
