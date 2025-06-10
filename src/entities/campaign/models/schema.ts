import { literal, preprocess, string, z } from "zod";

import { near } from "@/common/blockchains/near-protocol/client";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { feeBasisPointsToPercents } from "@/common/contracts/core/utils";
import { futureTimestamp, safePositiveNumber } from "@/common/lib";

import { CAMPAIGN_MAX_FEE_POINTS } from "../utils/constants";
import { isCampaignFeeValid } from "../utils/validation";

// Parses various inputs into a number or undefined, validates positive
const positiveNumberParser = preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    // Try parsing numeric input directly
    if (typeof value === "number") {
      return value;
    }

    // Try parsing string input
    if (typeof value === "string") {
      // Handle potential currency symbols or commas if necessary before parsing
      const numericString = value.replace(/[^0-9.]/g, ""); // Basic cleanup
      if (numericString === "") return undefined;
      const parsed = parseFloat(numericString);
      return isNaN(parsed) ? undefined : parsed;
    }

    return undefined; // Not a string or number we can handle
  },
  z
    .number({ invalid_type_error: "Must be a number" })
    .positive("Must be a positive number")
    .finite()
    .safe()
    .optional(), // Make the final type optional
);

export const integerCappedPercentage = preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  return typeof value === "string" ? safePositiveNumber.parse(value) : value;
}, safePositiveNumber.optional())
  .refine((percents) => percents === undefined || percents < 100, {
    message: "Must be less than 100%.",
  })
  .refine((percents) => percents === undefined || Number.isInteger(percents), {
    message: "Fractional percentage is not supported.",
  });

const ftIdSchema = literal(NATIVE_TOKEN_ID)
  .or(string().min(6))
  .default(NATIVE_TOKEN_ID)
  .describe('Either "NEAR" or FT contract account id.');

//* Base schema
const baseSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),

  description: z.string().max(250, "Description must be less than 250 characters").optional(),
  ft_id: ftIdSchema,
  target_amount: positiveNumberParser.describe("Target Amount of the campaign"),
  min_amount: positiveNumberParser.optional().describe("Minimum Amount of the Campaign"),
  max_amount: positiveNumberParser.optional().describe("Maximum Amount of the Campaign"),
  cover_image_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  end_ms: futureTimestamp.optional().describe("Campaign End Date"),
  owner: z.string().optional(),
  allow_fee_avoidance: z.boolean().optional().default(false),

  referral_fee_basis_points: integerCappedPercentage
    .optional()
    .refine((value) => value === undefined || isCampaignFeeValid(value), {
      message: `Cannot exceed ${feeBasisPointsToPercents(CAMPAIGN_MAX_FEE_POINTS)}%.`,
    }),

  creator_fee_basis_points: integerCappedPercentage
    .optional()
    .refine((value) => value === undefined || isCampaignFeeValid(value), {
      message: `Cannot exceed ${feeBasisPointsToPercents(CAMPAIGN_MAX_FEE_POINTS)}%.`,
    }),
});

//* Create schema
export const createCampaignSchema = baseSchema
  .extend({
    start_ms: futureTimestamp.describe("Campaign Start Date"),

    recipient: z.string().min(1, "Recipient account is required").refine(near.isAccountValid, {
      message: `Invalid Account, must be a valid NEAR account`,
    }),
  })
  .superRefine((data, ctx) => {
    if (data.end_ms && data.start_ms && data.start_ms >= data.end_ms) {
      ctx.addIssue({
        path: ["start_ms"],
        message: "Start time must be earlier than end time",
        code: "custom",
      });

      ctx.addIssue({
        path: ["end_ms"],
        message: "End time must be later than start time",
        code: "custom",
      });
    }

    const { min_amount, max_amount, target_amount } = data;

    if (min_amount !== undefined && max_amount !== undefined && min_amount > max_amount) {
      ctx.addIssue({
        path: ["min_amount"],
        message: "Min amount cannot be greater than Max amount",
        code: "custom",
      });

      ctx.addIssue({
        path: ["max_amount"],
        message: "Max amount cannot be less than Min amount",
        code: "custom",
      });
    }

    if (target_amount !== undefined && max_amount !== undefined && target_amount > max_amount) {
      ctx.addIssue({
        path: ["target_amount"],
        message: "Target amount cannot be greater than Max amount",
        code: "custom",
      });

      // Avoid duplicate max_amount message if already failed min/max check
      if (!(min_amount !== undefined && min_amount > max_amount)) {
        ctx.addIssue({
          path: ["max_amount"],
          message: "Max amount cannot be less than Target amount",
          code: "custom",
        });
      }
    }

    if (min_amount !== undefined && target_amount !== undefined && min_amount > target_amount) {
      // Avoid duplicate min_amount message
      if (!(max_amount !== undefined && min_amount > max_amount)) {
        ctx.addIssue({
          path: ["min_amount"],
          message: "Min amount cannot be greater than Target amount",
          code: "custom",
        });
      }

      // Avoid duplicate target_amount message
      if (!(max_amount !== undefined && target_amount > max_amount)) {
        ctx.addIssue({
          path: ["target_amount"],
          message: "Target amount cannot be less than Min amount",
          code: "custom",
        });
      }
    }
  });

//* Update schema
// Inherits baseSchema and its refinements implicitly if needed, but better to redefine extend + superRefine for clarity
export const updateCampaignSchema = baseSchema.extend({
  // start_ms might not be updatable or optional for update, adjust as needed
  start_ms: futureTimestamp.optional().describe("Campaign Start Date"),
  recipient: z
    .string()
    .min(1)
    .refine(near.isAccountValid, {
      // Ensure it's still valid if provided
      message: `Invalid Account, must be a valid NEAR account`,
    })
    .optional(), // Optional for update
});

export type CreateCampaignSchema = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignSchema = z.infer<typeof updateCampaignSchema>;
