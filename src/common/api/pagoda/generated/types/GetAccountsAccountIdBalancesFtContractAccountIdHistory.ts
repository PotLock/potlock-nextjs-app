import type { FtHistoryResponse } from "./FtHistoryResponse";

export type GetAccountsAccountIdBalancesFtContractAccountIdHistoryPathParams = {
  /**
   * @type string
   */
  account_id: string;
  /**
   * @type string
   */
  contract_account_id: string;
};
export type GetAccountsAccountIdBalancesFtContractAccountIdHistoryQueryParams =
  {
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
export type GetAccountsAccountIdBalancesFtContractAccountIdHistory200 =
  FtHistoryResponse;
/**
 * @description See the inner `code` value to get more details
 */
export type GetAccountsAccountIdBalancesFtContractAccountIdHistory500 = any;
/**
 * @description OK
 */
export type GetAccountsAccountIdBalancesFtContractAccountIdHistoryQueryResponse =
  FtHistoryResponse;
export type GetAccountsAccountIdBalancesFtContractAccountIdHistoryQuery = {
  Response: GetAccountsAccountIdBalancesFtContractAccountIdHistoryQueryResponse;
  PathParams: GetAccountsAccountIdBalancesFtContractAccountIdHistoryPathParams;
  QueryParams: GetAccountsAccountIdBalancesFtContractAccountIdHistoryQueryParams;
  Errors: GetAccountsAccountIdBalancesFtContractAccountIdHistory500;
};
