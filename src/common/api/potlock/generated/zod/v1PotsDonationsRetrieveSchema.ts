import { z } from "zod";

import { donationSchema } from "./donationSchema";

export const v1PotsDonationsRetrievePathParamsSchema = z.object({
  pot_id: z.string(),
});
/**
 * @description Returns donations for the pot
 */
export const v1PotsDonationsRetrieve200Schema = z.array(
  z.lazy(() => donationSchema),
);
/**
 * @description Pot not found
 */
export const v1PotsDonationsRetrieve404Schema = z.any();
/**
 * @description Returns donations for the pot
 */
export const v1PotsDonationsRetrieveQueryResponseSchema = z.array(
  z.lazy(() => donationSchema),
);
