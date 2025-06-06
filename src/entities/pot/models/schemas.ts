import { infer as FromSchema, array, boolean, object, string, z } from "zod";

import { feeBasisPointsToPercents } from "@/common/contracts/core/utils";
import { futureTimestamp, integerCappedPercentage, safePositiveNumber } from "@/common/lib";
import { validAccountIdOrNothing } from "@/entities/_shared/account";

import {
  POT_MAX_APPROVED_PROJECTS,
  POT_MAX_CHEF_FEE_BASIS_POINTS,
  POT_MAX_DESCRIPTION_LENGTH,
  POT_MAX_HANDLE_LENGTH,
  POT_MAX_NAME_LENGTH,
  POT_MAX_REFERRAL_FEE_MATCHING_POOL_BASIS_POINTS,
  POT_MAX_REFERRAL_FEE_PUBLIC_ROUND_BASIS_POINTS,
  POT_MIN_NAME_LENGTH,
} from "../constants";
import {
  isPotChefFeeValid,
  isPotMatchingPoolReferralFeeValid,
  isPotMaxProjectsValid,
  isPotPublicRoundReferralFeeValid,
} from "../utils/validation";

export const challengeSchema = z.object({
  message: z.string().min(3).max(1000, "Challenge reason must be less than 1000 characters"),
});

export type ChallengeInputs = FromSchema<typeof challengeSchema>;

export const challengeResolveSchema = z.object({
  message: z.string().min(3).max(1000, "Notes must be less than 1000 characters"),
  resolve: z.boolean().default(false),
});

export const potSchema = object({
  source_metadata: object({
    commit_hash: string().nullable(),
    link: string(),
    version: string(),
  }),

  owner: string().describe("Owner's account id."),

  admins: array(string()).optional().describe("List of pot admins' account ids."),

  chef: validAccountIdOrNothing.describe("Chef's account id."),

  pot_name: string()
    .min(POT_MIN_NAME_LENGTH, `Must be at least ${POT_MIN_NAME_LENGTH} characters long.`)
    .max(POT_MAX_NAME_LENGTH, `Must be less than ${POT_MAX_NAME_LENGTH} characters long.`)
    .describe("Pot name."),

  pot_handle: string()
    .max(POT_MAX_HANDLE_LENGTH, `Cannot be longer than ${POT_MAX_HANDLE_LENGTH} characters.`)
    .optional()
    .describe("Pot handle."),

  pot_description: string()
    .min(POT_MIN_NAME_LENGTH, `Must be at least ${10} characters long.`)
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

  application_start_ms: futureTimestamp.describe("Application period start date."),

  application_end_ms: futureTimestamp.describe("Application period end date."),
  public_round_start_ms: futureTimestamp.describe("Matching round start date."),
  public_round_end_ms: futureTimestamp.describe("Matching round end date."),

  min_matching_pool_donation_amount: safePositiveNumber.describe("Minimum donation amount."),

  registry_provider: string().optional().describe("Registry provider's account id."),

  isPgRegistrationRequired: boolean()
    .optional()
    .describe("Whether the projects must be included in POTLOCK PG registry with approval."),

  sybil_wrapper_provider: string().optional().describe("Sybil wrapper provider's account id."),

  isSybilResistanceEnabled: boolean()
    .optional()
    .describe("Whether the projects must have Nadabot verification."),

  referral_fee_matching_pool_basis_points: integerCappedPercentage
    .refine(isPotMatchingPoolReferralFeeValid, {
      message: `Cannot exceed ${feeBasisPointsToPercents(
        POT_MAX_REFERRAL_FEE_MATCHING_POOL_BASIS_POINTS,
      )}%.`,
    })
    .describe("Matching pool referral fee in basis points."),

  referral_fee_public_round_basis_points: integerCappedPercentage
    .refine(isPotPublicRoundReferralFeeValid, {
      message: `Cannot exceed ${feeBasisPointsToPercents(
        POT_MAX_REFERRAL_FEE_PUBLIC_ROUND_BASIS_POINTS,
      )}%.`,
    })
    .describe("Public round referral fee in basis points."),

  chef_fee_basis_points: integerCappedPercentage
    .refine(isPotChefFeeValid, {
      message: `Cannot exceed ${feeBasisPointsToPercents(POT_MAX_CHEF_FEE_BASIS_POINTS)}%.`,
    })
    .describe("Chef fee in basis points."),
});

export type PotInputs = FromSchema<typeof potSchema>;
