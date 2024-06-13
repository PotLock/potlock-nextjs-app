import { z } from "zod";

export const potPayoutSchema = z.object({
  id: z.number().describe("Payout id."),
  amount: z.string().max(64).describe("Payout amount."),
  amount_paid_usd: z
    .string()
    .regex(new RegExp("^-?\\d{0,18}(?:\\.\\d{0,2})?$"))
    .describe("Payout amount in USD.")
    .nullable()
    .nullish(),
  paid_at: z.string().datetime().describe("Payout date."),
  tx_hash: z.string().max(64).describe("Transaction hash."),
  pot: z.string().describe("Pot that this payout is for."),
  recipient: z.string().describe("Payout recipient."),
  ft: z.string().describe("Payout FT."),
});
