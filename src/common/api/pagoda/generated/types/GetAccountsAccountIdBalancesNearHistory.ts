import type { NearHistoryResponse } from "./NearHistoryResponse";

export type GetAccountsAccountIdBalancesNearHistoryPathParams = {
  /**
   * @type string
   */
  account_id: string;
};
export type GetAccountsAccountIdBalancesNearHistoryQueryParams = {
  /**
   * @type string | undefined
   */
  after_event_index?: string;
  /**
   * @description Maximum available limit 100
   * @type integer | undefined, int32
   */
  limit?: number;
};
/**
 * @description OK
 */
export type GetAccountsAccountIdBalancesNearHistory200 = NearHistoryResponse;
/**
 * @description See the inner `code` value to get more details
 */
export type GetAccountsAccountIdBalancesNearHistory500 = any;
/**
 * @description OK
 */
export type GetAccountsAccountIdBalancesNearHistoryQueryResponse =
  NearHistoryResponse;
export type GetAccountsAccountIdBalancesNearHistoryQuery = {
  Response: GetAccountsAccountIdBalancesNearHistoryQueryResponse;
  PathParams: GetAccountsAccountIdBalancesNearHistoryPathParams;
  QueryParams: GetAccountsAccountIdBalancesNearHistoryQueryParams;
  Errors: GetAccountsAccountIdBalancesNearHistory500;
};
