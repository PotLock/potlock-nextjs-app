import { z } from "zod";

export const potPayoutSchema = z.object({
  id: z.coerce.number().describe("Payout id."),
  amount: z.coerce.string().describe("Payout amount."),
  amount_paid_usd: z.coerce
    .string()
    .regex(new RegExp("^-?\\d{0,18}(?:\\.\\d{0,2})?$"))
    .describe("Payout amount in USD.")
    .nullable()
    .nullish(),
  paid_at: z.string().datetime().describe("Payout date."),
  tx_hash: z.coerce.string().describe("Transaction hash.").nullable().nullish(),
  pot: z.coerce.string().describe("Pot that this payout is for."),
  recipient: z.coerce.string().describe("Payout recipient."),
  ft: z.coerce.string().describe("Payout FT."),
});
