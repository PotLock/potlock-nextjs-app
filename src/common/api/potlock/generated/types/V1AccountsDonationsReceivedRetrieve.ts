import type { Donation } from "./Donation";

export type V1AccountsDonationsReceivedRetrievePathParams = {
  /**
   * @type string
   */
  account_id: string;
};
/**
 * @description Returns paginated donations received by the account
 */
export type V1AccountsDonationsReceivedRetrieve200 = Donation[];
/**
 * @description Account not found
 */
export type V1AccountsDonationsReceivedRetrieve404 = any;
/**
 * @description Internal server error
 */
export type V1AccountsDonationsReceivedRetrieve500 = any;
/**
 * @description Returns paginated donations received by the account
 */
export type V1AccountsDonationsReceivedRetrieveQueryResponse = Donation[];
export type V1AccountsDonationsReceivedRetrieveQuery = {
  Response: V1AccountsDonationsReceivedRetrieveQueryResponse;
  PathParams: V1AccountsDonationsReceivedRetrievePathParams;
  Errors:
    | V1AccountsDonationsReceivedRetrieve404
    | V1AccountsDonationsReceivedRetrieve500;
};
