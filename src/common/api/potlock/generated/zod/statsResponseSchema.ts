import { z } from "zod";


export const statsResponseSchema = z.object({ "total_donations_usd": z.number(), "total_payouts_usd": z.number(), "total_donations_count": z.number(), "total_donors_count": z.number(), "total_recipients_count": z.number() });