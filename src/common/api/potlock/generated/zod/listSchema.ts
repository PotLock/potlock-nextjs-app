import { z } from "zod";

import { defaultRegistrationStatusEnumSchema } from "./defaultRegistrationStatusEnumSchema";

export const listSchema = z.object({
  id: z.number().min(0).max(2147483647).describe("List id."),
  name: z.string().max(64).describe("List name."),
  description: z
    .string()
    .max(256)
    .describe("List description.")
    .nullable()
    .nullish(),
  cover_image_url: z
    .string()
    .url()
    .max(200)
    .describe("Cover image url.")
    .nullable()
    .nullish(),
  admin_only_registrations: z.boolean().describe("Admin only registrations."),
  default_registration_status: z
    .lazy(() => defaultRegistrationStatusEnumSchema)
    .describe(
      "Default registration status.\n\n* `Pending` - Pending\n* `Approved` - Approved\n* `Rejected` - Rejected\n* `Graylisted` - Graylisted\n* `Blacklisted` - Blacklisted",
    ),
  created_at: z.string().datetime().describe("List creation date."),
  updated_at: z.string().datetime().describe("List last update date."),
  owner: z.string().describe("List owner."),
  admins: z.array(z.string()).describe("List admins."),
});
