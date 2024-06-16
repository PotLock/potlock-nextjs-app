import { z } from "zod";

import { donationSchema } from "./donationSchema";

export const v1AccountsDonationsSentRetrievePathParamsSchema = z.object({
  account_id: z.string(),
});
/**
 * @description Returns paginated donations sent by the account
 */
export const v1AccountsDonationsSentRetrieve200Schema = z.array(
  z.lazy(() => donationSchema),
);
/**
 * @description Account not found
 */
export const v1AccountsDonationsSentRetrieve404Schema = z.any();
/**
 * @description Internal server error
 */
export const v1AccountsDonationsSentRetrieve500Schema = z.any();
/**
 * @description Returns paginated donations sent by the account
 */
export const v1AccountsDonationsSentRetrieveQueryResponseSchema = z.array(
  z.lazy(() => donationSchema),
);
