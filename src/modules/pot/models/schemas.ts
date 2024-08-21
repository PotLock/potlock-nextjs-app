import { z } from "zod";

export const fundMatchingPoolSchema = z.object({
  amountNEAR: z
    .number()
    .positive("The amount must be greater than 0. Ex: 0.0001"),
  message: z
    .string()
    .max(100, "Message must be less than 100 characters")
    .optional(),
  bypassProtocolFee: z.boolean().default(false),
  bypassChefFee: z.boolean().default(false),
});

export const newApplicationSchema = z.object({
  message: z
    .string()
    .min(3)
    .max(1000, "Message must be less than 100 characters"),
});
