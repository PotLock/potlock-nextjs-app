import { infer as FromSchema, array, boolean, object, string } from "zod";

import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { futureTimestamp, safePositiveNumber } from "@/common/lib";
import {
  DONATION_MIN_NEAR_AMOUNT,
  donationAmount,
  donationFeeBasicPoints,
  isDonationAmountSufficient,
} from "@/modules/donation";

import {
  isPotApplicationStartBeforeEnd,
  isPotPublicRoundStartBeforeEnd,
} from "../utils/validation";

export const potDeploymentSchema = object({
  owner: string().describe("Owner's account id."),

  admins: array(string())
    .optional()
    .describe("List of pot admins' account ids."),

  chef: string().optional().describe("Chef's account id."),

  pot_name: string()
    .min(3, "Pot name must be at least 3 characters long.")
    .describe("Pot name."),

  pot_handle: string().optional().describe("Pot handle."),
  pot_description: string().describe("Pot description."),

  max_projects: safePositiveNumber.describe(
    "Maximum number of approved projects.",
  ),

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

  referral_fee_matching_pool_basis_points: donationFeeBasicPoints.describe(
    "Matching pool referral fee in basis points.",
  ),

  referral_fee_public_round_basis_points: donationFeeBasicPoints.describe(
    "Public round referral fee in basis points.",
  ),

  chef_fee_basis_points: donationFeeBasicPoints.describe(
    "Chef fee in basis points.",
  ),
})
  .refine(isPotApplicationStartBeforeEnd, {
    message: "Application cannot end before it starts.",
  })
  .refine(isPotPublicRoundStartBeforeEnd, {
    message: "Public round cannot end before it starts.",
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
  );

export type PotDeploymentInputs = FromSchema<typeof potDeploymentSchema>;
