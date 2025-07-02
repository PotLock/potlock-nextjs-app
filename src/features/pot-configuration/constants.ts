import { Temporal } from "temporal-polyfill";

import type { Pot } from "@/common/api/indexer";

import { PotConfigurationParameters } from "./types";

export const POT_DEFAULT_MIN_DATE = Temporal.Now.instant().toString();

export const POT_EDITOR_EXCLUDED_INDEXED_PROPERTIES = [
  "all_paid_out",
  "base_currency",
  "cooldown_end",
  "cooldown_period_ms",
  "custom_min_threshold_score",
  "custom_sybil_checks",
  "deployed_at",
  "deployer",
  "matching_pool_balance",
  "matching_pool_donations_count",
  "pot_factory",
  "protocol_config_provider",
  "public_donations_count",
  "source_metadata",
  "total_matching_pool",
  "total_matching_pool_usd",
  "total_public_donations",
  "total_public_donations_usd",
] as const satisfies readonly (keyof Pot)[];

export const POT_EDITOR_FIELDS: PotConfigurationParameters = {
  owner: { index: "owner", title: "Owner" },
  admins: { index: "admins", title: "Admins" },
  pot_name: { index: "name", title: "Name" },
  pot_handle: { title: "Custom handle" },
  pot_description: { index: "description", title: "Description" },

  application_start_ms: {
    index: "application_start",
    title: "Application start date",
  },

  application_end_ms: {
    index: "application_end",
    title: "Application end date",
  },

  public_round_start_ms: {
    index: "matching_round_start",
    title: "Matching round start date",
  },

  public_round_end_ms: {
    index: "matching_round_end",
    title: "Matching round end date",
  },

  min_matching_pool_donation_amount: {
    index: "min_matching_pool_donation_amount",
    title: "Min matching pool donation",
  },

  referral_fee_matching_pool_basis_points: {
    index: "referral_fee_matching_pool_basis_points",
    title: "Referral fee",
    subtitle: "(Matching Pool)",
  },

  referral_fee_public_round_basis_points: {
    index: "referral_fee_public_round_basis_points",
    title: "Referral fee",
    subtitle: "(Public Round)",
  },

  chef_fee_basis_points: {
    index: "chef_fee_basis_points",
    title: "Chef fee",
  },

  chef: { index: "chef", title: "Assigned Chef" },

  max_projects: {
    index: "max_approved_applicants",
    title: "Max. approved projects",
  },

  registry_provider: {
    index: "registry_provider",
    title: "Project Registration",
    subtitle: "Requires approval on Public Goods Registry",
  },

  isPgRegistrationRequired: {
    title: "Project Registration.",
    subtitle: "Require approval on Public Goods Registry",
  },

  sybil_wrapper_provider: {
    index: "sybil_wrapper_provider",
    title: "Donor Sybil Resistance",
    subtitle: "🤖 nada.bot human score",
  },

  isSybilResistanceEnabled: {
    title: "Donor Sybil Resistance.",
    subtitle: "🤖 nada.bot human verification",
  },
};
