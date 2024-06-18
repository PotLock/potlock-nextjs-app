import type { NftsResponse } from "./NftsResponse";

export type GetAccountsAccountIdNftContractAccountIdPathParams = {
  /**
   * @type string
   */
  account_id: string;
  /**
   * @type string
   */
  contract_account_id: string;
};
export type GetAccountsAccountIdNftContractAccountIdQueryParams = {
  /**
   * @type integer | undefined, int32
   */
  limit?: number;
};
/**
 * @description OK
 */
export type GetAccountsAccountIdNftContractAccountId200 = NftsResponse;
/**
 * @description See the inner `code` value to get more details
 */
export type GetAccountsAccountIdNftContractAccountId500 = any;
/**
 * @description OK
 */
export type GetAccountsAccountIdNftContractAccountIdQueryResponse =
  NftsResponse;
export type GetAccountsAccountIdNftContractAccountIdQuery = {
  Response: GetAccountsAccountIdNftContractAccountIdQueryResponse;
  PathParams: GetAccountsAccountIdNftContractAccountIdPathParams;
  QueryParams: GetAccountsAccountIdNftContractAccountIdQueryParams;
  Errors: GetAccountsAccountIdNftContractAccountId500;
};
