import { z } from "zod";

export const linktreeSchema = z.object({
  github: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
  telegram: z.string().optional(),
});
