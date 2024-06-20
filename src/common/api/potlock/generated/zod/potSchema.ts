import { z } from "zod";

export const potSchema = z.object({
  id: z.string().describe("Pot account ID."),
  pot_factory: z.string().describe("Pot factory."),
  deployer: z.string(),
  deployed_at: z.string().datetime().describe("Pot deployment date."),
  source_metadata: z.any(),
  owner: z.string(),
  admins: z.string(),
  chef: z.string(),
  name: z.string().describe("Pot name."),
  description: z.string().describe("Pot description."),
  max_approved_applicants: z
    .number()
    .min(0)
    .max(2147483647)
    .describe("Max approved applicants."),
  base_currency: z
    .string()
    .max(64)
    .describe("Base currency.")
    .nullable()
    .nullish(),
  application_start: z
    .string()
    .datetime()
    .describe("Pot application start date."),
  application_end: z.string().datetime().describe("Pot application end date."),
  matching_round_start: z
    .string()
    .datetime()
    .describe("Pot matching round start date."),
  matching_round_end: z
    .string()
    .datetime()
    .describe("Pot matching round end date."),
  registry_provider: z
    .string()
    .describe("Registry provider.")
    .nullable()
    .nullish(),
  min_matching_pool_donation_amount: z
    .string()
    .describe("Min matching pool donation amount."),
  sybil_wrapper_provider: z
    .string()
    .describe("Sybil wrapper provider.")
    .nullable()
    .nullish(),
  custom_sybil_checks: z
    .string()
    .describe("Custom sybil checks.")
    .nullable()
    .nullish(),
  custom_min_threshold_score: z
    .number()
    .min(0)
    .max(2147483647)
    .describe("Custom min threshold score.")
    .nullable()
    .nullish(),
  referral_fee_matching_pool_basis_points: z
    .number()
    .min(0)
    .max(2147483647)
    .describe("Referral fee matching pool basis points."),
  referral_fee_public_round_basis_points: z
    .number()
    .min(0)
    .max(2147483647)
    .describe("Referral fee public round basis points."),
  chef_fee_basis_points: z
    .number()
    .min(0)
    .max(2147483647)
    .describe("Chef fee basis points."),
  total_matching_pool: z.string().describe("Total matching pool."),
  total_matching_pool_usd: z
    .string()
    .regex(new RegExp("^-?\\d{0,18}(?:\\.\\d{0,2})?$")),
  matching_pool_balance: z.string().describe("Matching pool balance."),
  matching_pool_donations_count: z
    .number()
    .min(0)
    .max(2147483647)
    .describe("Matching pool donations count."),
  total_public_donations: z.string().describe("Total public donations."),
  total_public_donations_usd: z
    .string()
    .regex(new RegExp("^-?\\d{0,18}(?:\\.\\d{0,2})?$")),
  public_donations_count: z
    .number()
    .min(0)
    .max(2147483647)
    .describe("Public donations count."),
  cooldown_end: z
    .string()
    .datetime()
    .describe("Pot cooldown end date.")
    .nullable()
    .nullish(),
  cooldown_period_ms: z
    .number()
    .min(0)
    .max(2147483647)
    .describe("Pot cooldown period in ms.")
    .nullable()
    .nullish(),
  all_paid_out: z.boolean().describe("All paid out."),
  protocol_config_provider: z
    .string()
    .describe("Protocol config provider.")
    .nullable()
    .nullish(),
});
