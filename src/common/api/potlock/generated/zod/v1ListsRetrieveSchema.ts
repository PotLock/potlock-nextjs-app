import { z } from "zod";

import { listSchema } from "./listSchema";

/**
 * @description Returns a paginated list of lists
 */
export const v1ListsRetrieve200Schema = z.array(z.lazy(() => listSchema));
/**
 * @description Internal server error
 */
export const v1ListsRetrieve500Schema = z.any();
/**
 * @description Returns a paginated list of lists
 */
export const v1ListsRetrieveQueryResponseSchema = z.array(
  z.lazy(() => listSchema),
);
