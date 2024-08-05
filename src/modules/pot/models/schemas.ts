import { Temporal } from "temporal-polyfill";
import {
  infer as FromSchema,
  array,
  boolean,
  number,
  object,
  preprocess,
  string,
} from "zod";

import { NEAR_TOKEN_DENOM } from "@/common/constants";
import {
  DONATION_MIN_NEAR_AMOUNT,
  isDonationAmountSufficient,
} from "@/modules/donation";

import { test } from "../utils/validation";

export const minMatchingPoolDonationAmountSchema = preprocess(
  (x) => parseFloat(x as string),

  number({ message: "Must be a positive number." })
    .positive("Must be a positive number.")
    .finite()
    .safe()
    .transform((n) => number().safeParse(n).data ?? 0),
);

export const potDeploymentSchema = object({
  owner: string().describe("Owner's account id."),

  admins: array(string())
    .optional()
    .describe("List of pot admins' account ids."),

  chef: string().optional().describe("Chef's account id."),
  pot_name: string().describe("Pot name."),
  pot_handle: string().optional().describe("Pot handle."),
  pot_description: string().describe("Pot description."),
  max_projects: number().describe("Maximum number of approved projects."),
  application_start_ms: number().describe("Application start timestamp."),
  application_end_ms: number().describe("Application end timestamp."),
  public_round_start_ms: number().describe("Matching round start timestamp."),
  public_round_end_ms: number().describe("Matching round end timestamp."),

  min_matching_pool_donation_amount: minMatchingPoolDonationAmountSchema
    .optional()
    .describe("Minimum donation amount."),

  cooldown_period_ms: number()
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

  referral_fee_matching_pool_basis_points: number().describe(
    "Matching pool referral fee in basis points.",
  ),

  referral_fee_public_round_basis_points: number().describe(
    "Public round referral fee in basis points.",
  ),

  chef_fee_basis_points: number().describe("Chef fee in basis points."),
})
  .refine(
    ({ min_matching_pool_donation_amount }) =>
      min_matching_pool_donation_amount === undefined
        ? true
        : isDonationAmountSufficient({
            tokenId: NEAR_TOKEN_DENOM,
            amount: min_matching_pool_donation_amount,
          }),
    {
      /**
       *? NOTE: Due to an unknown issue,
       *?  this message doesn't end up in react-hook-form's `formState.errors`.
       *?  Please make sure it's always manually provided to the corresponding input field.
       */
      message: `Minimum donation amount cannot be less than ${DONATION_MIN_NEAR_AMOUNT} ${NEAR_TOKEN_DENOM.toUpperCase()}.`,
    },
  )
  .refine(test, { message: "Invalid timestamps." });

export type PotDeploymentInputs = FromSchema<typeof potDeploymentSchema>;
