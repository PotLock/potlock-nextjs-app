import { z } from "zod";

import { donationSchema } from "./donationSchema";

export const v1AccountsPayoutsReceivedRetrievePathParamsSchema = z.object({
  account_id: z.string(),
});
/**
 * @description Returns paginated payouts received by the account
 */
export const v1AccountsPayoutsReceivedRetrieve200Schema = z.array(
  z.lazy(() => donationSchema),
);
/**
 * @description Account not found
 */
export const v1AccountsPayoutsReceivedRetrieve404Schema = z.any();
/**
 * @description Internal server error
 */
export const v1AccountsPayoutsReceivedRetrieve500Schema = z.any();
/**
 * @description Returns paginated payouts received by the account
 */
export const v1AccountsPayoutsReceivedRetrieveQueryResponseSchema = z.array(
  z.lazy(() => donationSchema),
);
