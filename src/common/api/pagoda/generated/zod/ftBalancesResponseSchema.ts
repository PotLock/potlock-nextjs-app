import { z } from "zod";

export const ftBalancesResponseSchema = z.object({
  balances: z.array(
    z.object({
      amount: z.coerce.string(),
      contract_account_id: z.coerce.string(),
      metadata: z
        .object({
          decimals: z.coerce.number(),
          icon: z.coerce.string().optional(),
          name: z.coerce.string(),
          symbol: z.coerce.string(),
        })
        .describe(
          "This type describes general Metadata info, collecting the most important fields from different standards in the one format.",
        ),
    }),
  ),
  block_height: z.coerce.string(),
  block_timestamp_nanos: z.coerce.string(),
});
