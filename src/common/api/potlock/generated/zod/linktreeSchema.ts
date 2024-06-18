import { z } from "zod";

export const linktreeSchema = z.object({
  github: z.coerce.string().optional(),
  twitter: z.coerce.string().optional(),
  website: z.coerce.string().optional(),
  telegram: z.coerce.string().optional(),
});
