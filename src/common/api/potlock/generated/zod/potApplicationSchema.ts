import { z } from "zod";

import { potApplicationStatusEnumSchema } from "./potApplicationStatusEnumSchema";

export const potApplicationSchema = z.object({
  id: z.number().describe("Application id."),
  pot: z.string(),
  applicant: z.string(),
  message: z
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
  tx_hash: z.string().describe("Transaction hash.").nullable().nullish(),
});
