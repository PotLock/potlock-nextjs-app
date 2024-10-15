import { z } from "zod";

export const campaignFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(250, "Description must be less than 100 characters")
    .optional(),
  target_amount: z.number().min(0, "Target amount must be at least 1"),
  min_amount: z.number().min(1, "Min amount must be at least 1").optional(),
  max_amount: z.number().min(1, "Max amount must be at least 1").optional(),
  cover_image_url: z.string().optional(),
  start_ms: z.number(),
  end_ms: z.number()?.optional(),
  owner: z.string(),
  recipient: z.string(),
});
