import { z } from "zod";

import { nearSocialProfileDataSchema } from "./nearSocialProfileDataSchema";

export const accountSchema = z.object({
  id: z.string().max(64).describe("On-chain account address."),
  total_donations_in_usd: z
    .number()
    .min(-1000000000000000000)
    .max(1000000000000000000),
  total_donations_out_usd: z
    .number()
    .min(-1000000000000000000)
    .max(1000000000000000000),
  total_matching_pool_allocations_usd: z
    .number()
    .min(-1000000000000000000)
    .max(1000000000000000000),
  donors_count: z.number(),
  near_social_profile_data: z
    .lazy(() => nearSocialProfileDataSchema)
    .optional(),
});
