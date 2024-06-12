import { z } from "zod";

export const donationSchema = z.object({
  id: z.number().describe("Donation id."),
  on_chain_id: z
    .number()
    .min(-2147483648)
    .max(2147483647)
    .describe("Donation id in contract"),
  total_amount: z.string().max(64).describe("Total amount."),
  total_amount_usd: z
    .string()
    .regex(new RegExp("^-?\\d{0,18}(?:\\.\\d{0,2})?$"))
    .describe("Total amount in USD.")
    .nullable()
    .nullish(),
  net_amount: z.string().max(64).describe("Net amount."),
  net_amount_usd: z
    .string()
    .regex(new RegExp("^-?\\d{0,18}(?:\\.\\d{0,2})?$"))
    .describe("Net amount in USD.")
    .nullable()
    .nullish(),
  matching_pool: z.boolean().describe("Matching pool."),
  message: z
    .string()
    .max(1024)
    .describe("Donation message.")
    .nullable()
    .nullish(),
  donated_at: z.string().datetime().describe("Donation date."),
  protocol_fee: z.string().max(64).describe("Protocol fee."),
  protocol_fee_usd: z
    .string()
    .regex(new RegExp("^-?\\d{0,18}(?:\\.\\d{0,2})?$"))
    .describe("Protocol fee in USD.")
    .nullable()
    .nullish(),
  referrer_fee: z
    .string()
    .max(64)
    .describe("Referrer fee.")
    .nullable()
    .nullish(),
  referrer_fee_usd: z
    .string()
    .regex(new RegExp("^-?\\d{0,18}(?:\\.\\d{0,2})?$"))
    .describe("Referrer fee in USD.")
    .nullable()
    .nullish(),
  chef_fee: z.string().max(64).describe("Chef fee.").nullable().nullish(),
  chef_fee_usd: z
    .string()
    .regex(new RegExp("^-?\\d{0,18}(?:\\.\\d{0,2})?$"))
    .describe("Chef fee in USD.")
    .nullable()
    .nullish(),
  tx_hash: z
    .string()
    .max(64)
    .describe("Transaction hash.")
    .nullable()
    .nullish(),
  donor: z.string().describe("Donor."),
  ft: z.string().describe("Donation FT."),
  pot: z.string().describe("Donation pot.").nullable(),
  recipient: z.string().describe("Donation recipient.").nullable().nullish(),
  referrer: z.string().describe("Donation referrer.").nullable().nullish(),
  chef: z.string().describe("Donation chef.").nullable().nullish(),
});
