import type { Donation } from "./Donation";

export type V1AccountsDonationsSentRetrievePathParams = {
  /**
   * @type string
   */
  account_id: string;
};
/**
 * @description Returns paginated donations sent by the account
 */
export type V1AccountsDonationsSentRetrieve200 = Donation[];
/**
 * @description Account not found
 */
export type V1AccountsDonationsSentRetrieve404 = any;
/**
 * @description Internal server error
 */
export type V1AccountsDonationsSentRetrieve500 = any;
/**
 * @description Returns paginated donations sent by the account
 */
export type V1AccountsDonationsSentRetrieveQueryResponse = Donation[];
export type V1AccountsDonationsSentRetrieveQuery = {
  Response: V1AccountsDonationsSentRetrieveQueryResponse;
  PathParams: V1AccountsDonationsSentRetrievePathParams;
  Errors:
    | V1AccountsDonationsSentRetrieve404
    | V1AccountsDonationsSentRetrieve500;
};
