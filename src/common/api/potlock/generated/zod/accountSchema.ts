import { z } from "zod";

export const accountSchema = z.object({
  id: z.string().max(64).describe("On-chain account address."),
  total_donations_in_usd: z
    .string()
    .regex(new RegExp("^-?\\d{0,18}(?:\\.\\d{0,2})?$"))
    .describe("Total donations received in USD.")
    .optional(),
  total_donations_out_usd: z
    .string()
    .regex(new RegExp("^-?\\d{0,18}(?:\\.\\d{0,2})?$"))
    .describe("Total donated in USD.")
    .optional(),
  total_matching_pool_allocations_usd: z
    .string()
    .regex(new RegExp("^-?\\d{0,18}(?:\\.\\d{0,2})?$"))
    .describe("Total matching pool allocations in USD.")
    .optional(),
  donors_count: z
    .number()
    .min(0)
    .max(2147483647)
    .describe("Number of donors.")
    .optional(),
  near_social_profile_data: z.any().nullish(),
});