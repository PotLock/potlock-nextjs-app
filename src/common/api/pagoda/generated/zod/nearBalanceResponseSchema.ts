import { z } from "zod";

export const nearBalanceResponseSchema = z.object({
  balance: z.object({
    amount: z.coerce.string().describe("Sum of staked and nonstaked balances"),
    metadata: z
      .object({
        decimals: z.coerce.number(),
        icon: z.coerce.string().optional(),
        name: z.coerce.string(),
        symbol: z.coerce.string(),
      })
      .describe("This type describes general Metadata info"),
  }),
  block_height: z.coerce.string(),
  block_timestamp_nanos: z.coerce.string(),
});
