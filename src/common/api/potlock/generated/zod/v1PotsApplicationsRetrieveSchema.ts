import { z } from "zod";

import { potApplicationSchema } from "./potApplicationSchema";

export const v1PotsApplicationsRetrievePathParamsSchema = z.object({
  pot_id: z.coerce.string(),
});
/**
 * @description Returns applications for the pot
 */
export const v1PotsApplicationsRetrieve200Schema = z.array(
  z.lazy(() => potApplicationSchema),
);
/**
 * @description Pot not found
 */
export const v1PotsApplicationsRetrieve404Schema = z.any();
/**
 * @description Returns applications for the pot
 */
export const v1PotsApplicationsRetrieveQueryResponseSchema = z.array(
  z.lazy(() => potApplicationSchema),
);
