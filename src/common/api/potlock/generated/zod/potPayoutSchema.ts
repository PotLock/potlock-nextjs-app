import { z } from "zod";

export const potPayoutSchema = z.object({
  id: z.number().describe("Payout id."),
  pot: z.string(),
  recipient: z.string(),
  amount: z.string().describe("Payout amount."),
  amount_paid_usd: z
    .string()
    .regex(new RegExp("^-?\\d{0,18}(?:\\.\\d{0,2})?$"))
    .describe("Payout amount in USD.")
    .nullable()
    .nullish(),
  token: z.string(),
  paid_at: z.string().datetime().describe("Payout date."),
  tx_hash: z.string().describe("Transaction hash.").nullable().nullish(),
});
