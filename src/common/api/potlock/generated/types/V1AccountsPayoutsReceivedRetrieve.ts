import type { Donation } from "./Donation";

export type V1AccountsPayoutsReceivedRetrievePathParams = {
  /**
   * @type string
   */
  account_id: string;
};
/**
 * @description Returns paginated payouts received by the account
 */
export type V1AccountsPayoutsReceivedRetrieve200 = Donation[];
/**
 * @description Account not found
 */
export type V1AccountsPayoutsReceivedRetrieve404 = any;
/**
 * @description Internal server error
 */
export type V1AccountsPayoutsReceivedRetrieve500 = any;
/**
 * @description Returns paginated payouts received by the account
 */
export type V1AccountsPayoutsReceivedRetrieveQueryResponse = Donation[];
export type V1AccountsPayoutsReceivedRetrieveQuery = {
  Response: V1AccountsPayoutsReceivedRetrieveQueryResponse;
  PathParams: V1AccountsPayoutsReceivedRetrievePathParams;
  Errors:
    | V1AccountsPayoutsReceivedRetrieve404
    | V1AccountsPayoutsReceivedRetrieve500;
};
