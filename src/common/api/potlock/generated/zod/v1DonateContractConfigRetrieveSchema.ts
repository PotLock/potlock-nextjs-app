import { z } from "zod";

import { donationContractConfigSchema } from "./donationContractConfigSchema";

/**
 * @description Returns config for donate.potlock.near
 */
export const v1DonateContractConfigRetrieve200Schema = z.lazy(
  () => donationContractConfigSchema,
);
/**
 * @description Internal server error
 */
export const v1DonateContractConfigRetrieve500Schema = z.any();
/**
 * @description Returns config for donate.potlock.near
 */
export const v1DonateContractConfigRetrieveQueryResponseSchema = z.lazy(
  () => donationContractConfigSchema,
);
