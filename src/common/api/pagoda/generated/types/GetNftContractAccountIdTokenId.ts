import type { NftResponse } from "./NftResponse";

export type GetNftContractAccountIdTokenIdPathParams = {
  /**
   * @type string
   */
  contract_account_id: string;
  /**
   * @type string
   */
  token_id: string;
};
export type GetNftContractAccountIdTokenIdQueryParams = {
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
export type GetNftContractAccountIdTokenId200 = NftResponse;
/**
 * @description See the inner `code` value to get more details
 */
export type GetNftContractAccountIdTokenId500 = any;
/**
 * @description OK
 */
export type GetNftContractAccountIdTokenIdQueryResponse = NftResponse;
export type GetNftContractAccountIdTokenIdQuery = {
  Response: GetNftContractAccountIdTokenIdQueryResponse;
  PathParams: GetNftContractAccountIdTokenIdPathParams;
  QueryParams: GetNftContractAccountIdTokenIdQueryParams;
  Errors: GetNftContractAccountIdTokenId500;
};
