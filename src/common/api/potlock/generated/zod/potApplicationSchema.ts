import { z } from "zod";

import { potApplicationStatusEnumSchema } from "./potApplicationStatusEnumSchema";

export const potApplicationSchema = z.object({
  id: z.coerce.number().describe("Application id."),
  message: z.coerce
    .string()
    .max(1024)
    .describe("Application message.")
    .nullable()
    .nullish(),
  status: z
    .lazy(() => potApplicationStatusEnumSchema)
    .describe(
      "Application status.\n\n* `Pending` - Pending\n* `Approved` - Approved\n* `Rejected` - Rejected\n* `InReview` - InReview",
    ),
  submitted_at: z.string().datetime().describe("Application submission date."),
  updated_at: z
    .string()
    .datetime()
    .describe("Application last update date.")
    .nullable()
    .nullish(),
  tx_hash: z.coerce.string().describe("Transaction hash.").nullable().nullish(),
  pot: z.coerce.string().describe("Pot applied to."),
  applicant: z.coerce.string().describe("Account that applied to the pot."),
});
