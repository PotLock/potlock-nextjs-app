import { preprocess, z } from "zod";

import { NETWORK } from "@/common/_config";
import { near } from "@/common/blockchains/near-protocol/client";
import { futureTimestamp, parseNumber } from "@/common/lib";

export const safePositiveNumber = preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      // Treat empty strings, null, or undefined as undefined
      return undefined;
    }

    if (typeof value === "string" || typeof value === "number") {
      const parsed = parseNumber(value);
      return isNaN(parsed) ? undefined : parsed;
    }

    return value;
  },
  z.union([z.number().positive("Must be a positive number.").finite().safe(), z.undefined()]),
);

// Base schema with common fields
const baseSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z.string().max(250, "Description must be less than 100 characters"),
  target_amount: safePositiveNumber.describe("Target Amount of the campaign"),
  min_amount: safePositiveNumber.optional().describe("Minimum Amount of the Campaign"),
  max_amount: safePositiveNumber.optional().describe("Maximum Amount of the Campaign"),
  cover_image_url: z.string().optional(),
  end_ms: futureTimestamp.describe("Campaign End Date"),
  owner: z.string()?.optional(),
});

// Schema for creating new campaigns
export const createCampaignSchema = baseSchema
  .extend({
    start_ms: futureTimestamp.describe("Campaign Start Date"),
    recipient: z.string().refine(near.isAccountValid, {
      message: `Invalid Account, must be a valid NEAR account`,
    }),
  })
  .superRefine((data, ctx) => {
    if (data.end_ms && data.start_ms >= data.end_ms) {
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
  });

// Schema for updating existing campaigns
export const updateCampaignSchema = baseSchema
  .extend({
    start_ms: futureTimestamp.optional().describe("Campaign Start Date"),
    recipient: z.string().optional(),
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
  });
