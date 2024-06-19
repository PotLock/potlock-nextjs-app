import type { StatsResponse } from "./StatsResponse";

/**
 * @description Returns statistics data
 */
export type V1StatsRetrieve200 = StatsResponse;
/**
 * @description Internal server error
 */
export type V1StatsRetrieve500 = any;
/**
 * @description Returns statistics data
 */
export type V1StatsRetrieveQueryResponse = StatsResponse;
export type V1StatsRetrieveQuery = {
  Response: V1StatsRetrieveQueryResponse;
  Errors: V1StatsRetrieve500;
};
