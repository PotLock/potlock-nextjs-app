import { object, string } from "zod";

import { FromSchema } from "@/common/types";

export const potApplicationSchema = object({
  message: string().min(3).max(1000, "Must be less than 1000 characters"),
});

export type PotApplicationInputs = FromSchema<typeof potApplicationSchema>;

export const potApplicationReviewSchema = object({
  message: string().min(3).max(1000, "Must be less than 1000 characters"),
});

export type PotApplicationReviewInputs = FromSchema<typeof potApplicationReviewSchema>;
