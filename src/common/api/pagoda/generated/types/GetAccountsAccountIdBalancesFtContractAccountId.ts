import type { FtBalanceByContractResponse } from "./FtBalanceByContractResponse";

export type GetAccountsAccountIdBalancesFtContractAccountIdPathParams = {
  /**
   * @type string
   */
  account_id: string;
  /**
   * @type string
   */
  contract_account_id: string;
};
export type GetAccountsAccountIdBalancesFtContractAccountIdQueryParams = {
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
export type GetAccountsAccountIdBalancesFtContractAccountId200 =
  FtBalanceByContractResponse;
/**
 * @description See the inner `code` value to get more details
 */
export type GetAccountsAccountIdBalancesFtContractAccountId500 = any;
/**
 * @description OK
 */
export type GetAccountsAccountIdBalancesFtContractAccountIdQueryResponse =
  FtBalanceByContractResponse;
export type GetAccountsAccountIdBalancesFtContractAccountIdQuery = {
  Response: GetAccountsAccountIdBalancesFtContractAccountIdQueryResponse;
  PathParams: GetAccountsAccountIdBalancesFtContractAccountIdPathParams;
  QueryParams: GetAccountsAccountIdBalancesFtContractAccountIdQueryParams;
  Errors: GetAccountsAccountIdBalancesFtContractAccountId500;
};
