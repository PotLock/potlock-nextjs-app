import type { NftCountsResponse } from "./NftCountsResponse";

export type GetAccountsAccountIdNftPathParams = {
  /**
   * @type string
   */
  account_id: string;
};
export type GetAccountsAccountIdNftQueryParams = {
  /**
   * @type integer | undefined, int32
   */
  limit?: number;
};
/**
 * @description OK
 */
export type GetAccountsAccountIdNft200 = NftCountsResponse;
/**
 * @description See the inner `code` value to get more details
 */
export type GetAccountsAccountIdNft500 = any;
/**
 * @description OK
 */
export type GetAccountsAccountIdNftQueryResponse = NftCountsResponse;
export type GetAccountsAccountIdNftQuery = {
  Response: GetAccountsAccountIdNftQueryResponse;
  PathParams: GetAccountsAccountIdNftPathParams;
  QueryParams: GetAccountsAccountIdNftQueryParams;
  Errors: GetAccountsAccountIdNft500;
};
