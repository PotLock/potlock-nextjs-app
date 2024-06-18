import type { FtContractMetadataResponse } from "./FtContractMetadataResponse";

export type GetNep141MetadataContractAccountIdPathParams = {
  /**
   * @type string
   */
  contract_account_id: string;
};
export type GetNep141MetadataContractAccountIdQueryParams = {
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
export type GetNep141MetadataContractAccountId200 = FtContractMetadataResponse;
/**
 * @description See the inner `code` value to get more details
 */
export type GetNep141MetadataContractAccountId500 = any;
/**
 * @description OK
 */
export type GetNep141MetadataContractAccountIdQueryResponse =
  FtContractMetadataResponse;
export type GetNep141MetadataContractAccountIdQuery = {
  Response: GetNep141MetadataContractAccountIdQueryResponse;
  PathParams: GetNep141MetadataContractAccountIdPathParams;
  QueryParams: GetNep141MetadataContractAccountIdQueryParams;
  Errors: GetNep141MetadataContractAccountId500;
};
