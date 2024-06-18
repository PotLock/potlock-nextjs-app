import type { NftHistoryResponse } from "./NftHistoryResponse";

export type GetNftContractAccountIdTokenIdHistoryPathParams = {
  /**
   * @type string
   */
  contract_account_id: string;
  /**
   * @type string
   */
  token_id: string;
};
export type GetNftContractAccountIdTokenIdHistoryQueryParams = {
  /**
   * @type integer | undefined, int32
   */
  limit?: number;
};
/**
 * @description OK
 */
export type GetNftContractAccountIdTokenIdHistory200 = NftHistoryResponse;
/**
 * @description See the inner `code` value to get more details
 */
export type GetNftContractAccountIdTokenIdHistory500 = any;
/**
 * @description OK
 */
export type GetNftContractAccountIdTokenIdHistoryQueryResponse =
  NftHistoryResponse;
export type GetNftContractAccountIdTokenIdHistoryQuery = {
  Response: GetNftContractAccountIdTokenIdHistoryQueryResponse;
  PathParams: GetNftContractAccountIdTokenIdHistoryPathParams;
  QueryParams: GetNftContractAccountIdTokenIdHistoryQueryParams;
  Errors: GetNftContractAccountIdTokenIdHistory500;
};
