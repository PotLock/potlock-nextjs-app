import type { NearBalanceResponse } from "./NearBalanceResponse";

export type GetAccountsAccountIdBalancesNearPathParams = {
  /**
   * @type string
   */
  account_id: string;
};
export type GetAccountsAccountIdBalancesNearQueryParams = {
  /**
   * @type string | undefined
   */
  block_height?: string;
  /**
   * @type string | undefined
   */
  block_timestamp_nanos?: string;
};
/**
 * @description OK
 */
export type GetAccountsAccountIdBalancesNear200 = NearBalanceResponse;
/**
 * @description See the inner `code` value to get more details
 */
export type GetAccountsAccountIdBalancesNear500 = any;
/**
 * @description OK
 */
export type GetAccountsAccountIdBalancesNearQueryResponse = NearBalanceResponse;
export type GetAccountsAccountIdBalancesNearQuery = {
  Response: GetAccountsAccountIdBalancesNearQueryResponse;
  PathParams: GetAccountsAccountIdBalancesNearPathParams;
  QueryParams: GetAccountsAccountIdBalancesNearQueryParams;
  Errors: GetAccountsAccountIdBalancesNear500;
};
