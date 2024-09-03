import { infer as FromSchema, array, boolean, object, string, z } from "zod";

import { futureTimestamp, safePositiveNumber } from "@/common/lib";
import { validAccountId } from "@/modules/core";
import {
  donationAmount,
  donationFeeBasisPoints,
  donationFeeBasisPointsToPercents,
} from "@/modules/donation";

import {
  POT_MAX_APPROVED_PROJECTS,
  POT_MAX_CHEF_FEE_BASIS_POINTS,
  POT_MAX_DESCRIPTION_LENGTH,
  POT_MAX_NAME_LENGTH,
  POT_MAX_REFERRAL_FEE_MATCHING_POOL_BASIS_POINTS,
  POT_MAX_REFERRAL_FEE_PUBLIC_ROUND_BASIS_POINTS,
  POT_MIN_COOLDOWN_PERIOD_MS,
  POT_MIN_NAME_LENGTH,
} from "../constants";
import {
  isPotApplicationStartBeforeEnd,
  isPotChefFeeValid,
  isPotCooldownPeriodValid,
  isPotMatchingPoolReferralFeeValid,
  isPotMaxProjectsValid,
  isPotPublicRoundReferralFeeValid,
  isPotPublicRoundStartAfterApplicationEnd,
  isPotPublicRoundStartBeforeEnd,
} from "../utils/validation";

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
    .max(1000, "Application message must be less than 1000 characters"),
});

export const challengeSchema = z.object({
  message: z
    .string()
    .min(3)
    .max(1000, "Challenge reason must be less than 1000 characters"),
});

export const applicationReviewSchema = z.object({
  message: z
    .string()
    .min(3)
    .max(1000, "Review must be less than 1000 characters"),
});

export const challengeResolveSchema = z.object({
  message: z
    .string()
    .min(3)
    .max(1000, "Notes must be less than 1000 characters"),
  resolve: z.boolean().default(false),
});

export const potSchema = object({
  source_metadata: object({
    commit_hash: string().nullable(),
    link: string(),
    version: string(),
  }),

  owner: string().describe("Owner's account id."),

  admins: array(string())
    .optional()
    .describe("List of pot admins' account ids."),

  chef: validAccountId.optional().describe("Chef's account id."),

  pot_name: string()
    .min(
      POT_MIN_NAME_LENGTH,
      `Must be at least ${POT_MIN_NAME_LENGTH} characters long.`,
    )
    .max(
      POT_MAX_NAME_LENGTH,
      `Must be less than ${POT_MAX_NAME_LENGTH} characters long.`,
    )
    .describe("Pot name."),

  pot_handle: string().optional().describe("Pot handle."),

  pot_description: string()
    .max(
      POT_MAX_DESCRIPTION_LENGTH,
      `Cannot be longer than ${POT_MAX_DESCRIPTION_LENGTH} characters.`,
    )
    .describe("Pot description."),

  max_projects: safePositiveNumber
    .refine(isPotMaxProjectsValid, {
      message: `Cannot exceed ${POT_MAX_APPROVED_PROJECTS}`,
    })
    .describe("Maximum number of approved projects."),

  application_start_ms: futureTimestamp.describe(
    "Application start timestamp.",
  ),

  application_end_ms: futureTimestamp.describe("Application end timestamp."),

  public_round_start_ms: futureTimestamp.describe(
    "Matching round start timestamp.",
  ),

  public_round_end_ms: futureTimestamp.describe(
    "Matching round end timestamp.",
  ),

  min_matching_pool_donation_amount: donationAmount
    .optional()
    .describe("Minimum donation amount."),

  cooldown_period_ms: safePositiveNumber
    .refine(isPotCooldownPeriodValid, {
      message: `Cooldown period must be at least ${POT_MIN_COOLDOWN_PERIOD_MS} ms`,
    })
    .optional()
    .describe("Cooldown period in milliseconds."),

  registry_provider: string()
    .optional()
    .describe("Registry provider's account id."),

  isPgRegistrationRequired: boolean()
    .optional()
    .describe(
      "Whether the projects must be included in PotLock PG registry with approval.",
    ),

  sybil_wrapper_provider: string()
    .optional()
    .describe("Sybil wrapper provider's account id."),

  isNadabotVerificationRequired: boolean()
    .optional()
    .describe("Whether the projects must have Nadabot verification."),

  referral_fee_matching_pool_basis_points: donationFeeBasisPoints
    .refine(isPotMatchingPoolReferralFeeValid, {
      message: `Cannot exceed ${donationFeeBasisPointsToPercents(
        POT_MAX_REFERRAL_FEE_MATCHING_POOL_BASIS_POINTS,
      )}%.`,
    })
    .describe("Matching pool referral fee in basis points."),

  referral_fee_public_round_basis_points: donationFeeBasisPoints
    .refine(isPotPublicRoundReferralFeeValid, {
      message: `Cannot exceed ${donationFeeBasisPointsToPercents(
        POT_MAX_REFERRAL_FEE_PUBLIC_ROUND_BASIS_POINTS,
      )}%.`,
    })
    .describe("Public round referral fee in basis points."),

  chef_fee_basis_points: donationFeeBasisPoints
    .refine(isPotChefFeeValid, {
      message: `Cannot exceed ${donationFeeBasisPointsToPercents(
        POT_MAX_CHEF_FEE_BASIS_POINTS,
      )}%.`,
    })
    .describe("Chef fee in basis points."),
})
  /**
   *! Heads up!
   *!  Make sure that any fields targeted here are listed in `potCrossFieldValidationTargets`
   *!  and have their corresponding error paths specified correctly.
   */
  .refine(isPotApplicationStartBeforeEnd, {
    message: "Application cannot end before it starts.",
    path: ["application_end_ms"],
  })
  .refine(isPotPublicRoundStartBeforeEnd, {
    message: "Public round cannot end before it starts.",
    path: ["public_round_end_ms"],
  })
  .refine(isPotPublicRoundStartAfterApplicationEnd, {
    message: "Public round can only start after application period ends.",
    path: ["public_round_start_ms"],
  });

export type PotInputs = FromSchema<typeof potSchema>;

export const potCrossFieldValidationTargets: (keyof PotInputs)[] = [
  "application_end_ms",
  "public_round_end_ms",
  "public_round_start_ms",
];
