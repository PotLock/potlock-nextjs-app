import {
  infer as FromSchema,
  array,
  boolean,
  number,
  object,
  string,
} from "zod";

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

  min_matching_pool_donation_amount: string()
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
});

export type PotDeploymentInputs = FromSchema<typeof potDeploymentSchema>;
