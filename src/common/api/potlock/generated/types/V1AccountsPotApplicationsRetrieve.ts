import type { PotApplication } from "./PotApplication";

export type V1AccountsPotApplicationsRetrievePathParams = {
  /**
   * @type string
   */
  account_id: string;
};
/**
 * @description Returns paginated pot applications for the account
 */
export type V1AccountsPotApplicationsRetrieve200 = PotApplication[];
/**
 * @description Invalid status value
 */
export type V1AccountsPotApplicationsRetrieve400 = any;
/**
 * @description Account not found
 */
export type V1AccountsPotApplicationsRetrieve404 = any;
/**
 * @description Internal server error
 */
export type V1AccountsPotApplicationsRetrieve500 = any;
/**
 * @description Returns paginated pot applications for the account
 */
export type V1AccountsPotApplicationsRetrieveQueryResponse = PotApplication[];
export type V1AccountsPotApplicationsRetrieveQuery = {
  Response: V1AccountsPotApplicationsRetrieveQueryResponse;
  PathParams: V1AccountsPotApplicationsRetrievePathParams;
  Errors:
    | V1AccountsPotApplicationsRetrieve400
    | V1AccountsPotApplicationsRetrieve404
    | V1AccountsPotApplicationsRetrieve500;
};
