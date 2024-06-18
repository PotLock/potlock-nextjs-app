import { z } from "zod";

export const statsResponseSchema = z.object({
  total_donations_usd: z.coerce.number(),
  total_payouts_usd: z.coerce.number(),
  total_donations_count: z.coerce.number(),
  total_donors_count: z.coerce.number(),
  total_recipients_count: z.coerce.number(),
});
