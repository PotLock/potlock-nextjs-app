import { z } from "zod";

import { potSchema } from "./potSchema";

/**
 * @description Returns a list of pots
 */
export const v1PotsRetrieve200Schema = z.array(z.lazy(() => potSchema));
/**
 * @description Returns a list of pots
 */
export const v1PotsRetrieveQueryResponseSchema = z.array(
  z.lazy(() => potSchema),
);
