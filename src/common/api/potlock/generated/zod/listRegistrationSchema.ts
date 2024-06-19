import { z } from "zod";

import { statusF24EnumSchema } from "./statusF24EnumSchema";

export const listRegistrationSchema = z.object({
  id: z.number().describe("Registration id."),
  status: z
    .lazy(() => statusF24EnumSchema)
    .describe(
      "Registration status.\n\n* `Pending` - Pending\n* `Approved` - Approved\n* `Rejected` - Rejected\n* `Graylisted` - Graylisted\n* `Blacklisted` - Blacklisted",
    ),
  submitted_at: z.string().datetime().describe("Registration submission date."),
  updated_at: z.string().datetime().describe("Registration last update date."),
  registrant_notes: z
    .string()
    .max(1024)
    .describe("Registrant notes.")
    .nullable()
    .nullish(),
  admin_notes: z
    .string()
    .max(1024)
    .describe("Admin notes.")
    .nullable()
    .nullish(),
  tx_hash: z
    .string()
    .max(64)
    .describe("Transaction hash.")
    .nullable()
    .nullish(),
  list: z.number().describe("List registered."),
  registrant: z.string().describe("Account that registered on the list."),
  registered_by: z.string().describe("Account that did the registration."),
});
