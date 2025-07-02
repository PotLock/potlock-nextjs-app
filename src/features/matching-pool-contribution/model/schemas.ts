import { boolean, number, object, string } from "zod";

import type { FromSchema } from "@/common/types";

export const matchingPoolFundingSchema = object({
  amountNEAR: number().positive("The amount must be greater than 0. Ex: 0.0001"),
  message: string().max(100, "Message must be less than 100 characters").optional(),

  bypassProtocolFee: boolean().default(false),
  bypassReferralFee: boolean().default(false),
  bypassChefFee: boolean().default(false),
});

export type MatchingPoolContributionInputs = FromSchema<typeof matchingPoolFundingSchema>;
