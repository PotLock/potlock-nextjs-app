import { z } from "zod";

export const createListSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(250, "Description must be less than 100 characters"),
});
