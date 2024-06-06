import { z } from "zod";

import { statsResponseSchema } from "./statsResponseSchema";

/**
 * @description Returns statistics data
 */
export const v1StatsRetrieve200Schema = z.lazy(() => statsResponseSchema);
/**
 * @description Internal server error
 */
export const v1StatsRetrieve500Schema = z.any();
/**
 * @description Returns statistics data
 */
export const v1StatsRetrieveQueryResponseSchema = z.lazy(
  () => statsResponseSchema,
);
