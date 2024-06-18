import type { FtBalancesResponse } from "./FtBalancesResponse";

export type GetAccountsAccountIdBalancesFtPathParams = {
  /**
   * @type string
   */
  account_id: string;
};
export type GetAccountsAccountIdBalancesFtQueryParams = {
  /**
   * @type string | undefined
   */
  block_height?: string;
  /**
   * @type string | undefined
   */
  block_timestamp_nanos?: string;
  /**
   * @type integer | undefined, int32
   */
  limit?: number;
};
/**
 * @description OK
 */
export type GetAccountsAccountIdBalancesFt200 = FtBalancesResponse;
/**
 * @description See the inner `code` value to get more details
 */
export type GetAccountsAccountIdBalancesFt500 = any;
/**
 * @description OK
 */
export type GetAccountsAccountIdBalancesFtQueryResponse = FtBalancesResponse;
export type GetAccountsAccountIdBalancesFtQuery = {
  Response: GetAccountsAccountIdBalancesFtQueryResponse;
  PathParams: GetAccountsAccountIdBalancesFtPathParams;
  QueryParams: GetAccountsAccountIdBalancesFtQueryParams;
  Errors: GetAccountsAccountIdBalancesFt500;
};
