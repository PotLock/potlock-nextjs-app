import { z } from "zod";

export const matchingPoolFundingSchema = z.object({
  amountNEAR: z.number().positive("The amount must be greater than 0. Ex: 0.0001"),
  message: z.string().max(100, "Message must be less than 100 characters").optional(),
  bypassProtocolFee: z.boolean().default(false),
  bypassChefFee: z.boolean().default(false),
});

export type MatchingPoolFundingInputs = z.infer<typeof matchingPoolFundingSchema>;
