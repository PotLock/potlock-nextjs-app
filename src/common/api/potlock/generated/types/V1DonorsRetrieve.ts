import type { Account } from "./Account";

export type V1DonorsRetrieveQueryParams = {
  /**
   * @description Sort by field, e.g., most_donated_usd
   * @type string | undefined
   */
  sort?: string;
};
/**
 * @description Returns a list of donor accounts
 */
export type V1DonorsRetrieve200 = Account[];
/**
 * @description Internal server error
 */
export type V1DonorsRetrieve500 = any;
/**
 * @description Returns a list of donor accounts
 */
export type V1DonorsRetrieveQueryResponse = Account[];
export type V1DonorsRetrieveQuery = {
  Response: V1DonorsRetrieveQueryResponse;
  QueryParams: V1DonorsRetrieveQueryParams;
  Errors: V1DonorsRetrieve500;
};
