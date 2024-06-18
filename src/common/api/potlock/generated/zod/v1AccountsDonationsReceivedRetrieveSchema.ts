import { z } from "zod";

import { donationSchema } from "./donationSchema";

export const v1AccountsDonationsReceivedRetrievePathParamsSchema = z.object({
  account_id: z.coerce.string(),
});
/**
 * @description Returns paginated donations received by the account
 */
export const v1AccountsDonationsReceivedRetrieve200Schema = z.array(
  z.lazy(() => donationSchema),
);
/**
 * @description Account not found
 */
export const v1AccountsDonationsReceivedRetrieve404Schema = z.any();
/**
 * @description Internal server error
 */
export const v1AccountsDonationsReceivedRetrieve500Schema = z.any();
/**
 * @description Returns paginated donations received by the account
 */
export const v1AccountsDonationsReceivedRetrieveQueryResponseSchema = z.array(
  z.lazy(() => donationSchema),
);
