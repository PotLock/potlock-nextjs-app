import type { DonationContractConfig } from "./DonationContractConfig";

/**
 * @description Returns config for donate.potlock.near
 */
export type V1DonateContractConfigRetrieve200 = DonationContractConfig;
/**
 * @description Internal server error
 */
export type V1DonateContractConfigRetrieve500 = any;
/**
 * @description Returns config for donate.potlock.near
 */
export type V1DonateContractConfigRetrieveQueryResponse =
  DonationContractConfig;
export type V1DonateContractConfigRetrieveQuery = {
  Response: V1DonateContractConfigRetrieveQueryResponse;
  Errors: V1DonateContractConfigRetrieve500;
};
