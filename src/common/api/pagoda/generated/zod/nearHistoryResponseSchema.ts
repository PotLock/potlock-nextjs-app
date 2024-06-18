import { z } from "zod";

export const nearHistoryResponseSchema = z.object({
  block_height: z.coerce.string(),
  block_timestamp_nanos: z.coerce.string(),
  history: z.array(
    z
      .object({
        balance: z.coerce.string(),
        block_height: z.coerce.string(),
        block_timestamp_nanos: z.coerce.string(),
        cause: z.coerce.string(),
        delta_balance: z.coerce.string(),
        event_index: z.coerce.string(),
        involved_account_id: z.coerce.string().optional(),
        metadata: z
          .object({
            decimals: z.coerce.number(),
            icon: z.coerce.string().optional(),
            name: z.coerce.string(),
            symbol: z.coerce.string(),
          })
          .describe("This type describes general Metadata info"),
        status: z.coerce.string(),
      })
      .describe(
        "This type describes the history of the operations (NEAR, FT) for the given user.",
      ),
  ),
});
