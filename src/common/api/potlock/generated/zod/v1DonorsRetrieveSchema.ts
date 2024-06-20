import { z } from "zod";

import { accountSchema } from "./accountSchema";

export const v1DonorsRetrieveQueryParamsSchema = z
  .object({
    sort: z
      .string()
      .describe("Sort by field, e.g., most_donated_usd")
      .optional(),
  })
  .optional();
/**
 * @description Returns a paginated list of donor accounts
 */
export const v1DonorsRetrieve200Schema = z.array(z.lazy(() => accountSchema));
/**
 * @description Internal server error
 */
export const v1DonorsRetrieve500Schema = z.any();
/**
 * @description Returns a paginated list of donor accounts
 */
export const v1DonorsRetrieveQueryResponseSchema = z.array(
  z.lazy(() => accountSchema),
);
