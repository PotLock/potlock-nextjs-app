import { z } from "zod";

import { potSchema } from "./potSchema";

export const v1PotsRetrieve2PathParamsSchema = z.object({
  pot_id: z.coerce.string(),
});
/**
 * @description Returns pot details
 */
export const v1PotsRetrieve2200Schema = z.lazy(() => potSchema);
/**
 * @description Pot not found
 */
export const v1PotsRetrieve2404Schema = z.any();
/**
 * @description Returns pot details
 */
export const v1PotsRetrieve2QueryResponseSchema = z.lazy(() => potSchema);
