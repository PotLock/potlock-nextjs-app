import type { MetadataResponse } from "./MetadataResponse";

export type GetNep171MetadataContractAccountIdPathParams = {
  /**
   * @type string
   */
  contract_account_id: string;
};
export type GetNep171MetadataContractAccountIdQueryParams = {
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
export type GetNep171MetadataContractAccountId200 = MetadataResponse;
/**
 * @description See the inner `code` value to get more details
 */
export type GetNep171MetadataContractAccountId500 = any;
/**
 * @description OK
 */
export type GetNep171MetadataContractAccountIdQueryResponse = MetadataResponse;
export type GetNep171MetadataContractAccountIdQuery = {
  Response: GetNep171MetadataContractAccountIdQueryResponse;
  PathParams: GetNep171MetadataContractAccountIdPathParams;
  QueryParams: GetNep171MetadataContractAccountIdQueryParams;
  Errors: GetNep171MetadataContractAccountId500;
};
