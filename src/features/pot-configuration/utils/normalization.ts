import { conditional, evolve, isNonNullish, piped } from "remeda";
import { Temporal } from "temporal-polyfill";

import { LISTS_CONTRACT_ACCOUNT_ID, SYBIL_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { Account, Pot } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID, PROVIDER_ID_DELIMITER } from "@/common/constants";
import { PotConfig } from "@/common/contracts/core/pot";
import { type ContractSourceMetadata, type PotArgs } from "@/common/contracts/core/pot-factory";
import { feeBasisPointsToPercents } from "@/common/contracts/core/utils";
import { floatToYoctoNear, safePositiveNumber, timestamp, yoctoNearToFloat } from "@/common/lib";
import { PotInputs } from "@/entities/pot";

import { PotSettings } from "../model";
import { PotConfigurationParameter, PotConfigurationParameterKey } from "../types";

/**
 * Converts PotConfig to form settings.
 * Includes all dates for display in the form.
 * Past dates are filtered out when submitting via filterPastDatesForSubmit.
 */
export const potConfigToSettings = ({
  chef,
  registry_provider,
  sybil_wrapper_provider,
  owner,
  admins,
  pot_name,
  pot_description,
  max_projects,
  application_start_ms,
  application_end_ms,
  public_round_start_ms,
  public_round_end_ms,
  min_matching_pool_donation_amount,
  referral_fee_matching_pool_basis_points,
  referral_fee_public_round_basis_points,
  chef_fee_basis_points,
  // Exclude read-only fields: matching_pool_balance, total_public_donations,
  // public_donations_count, payouts, cooldown_end_ms, all_paid_out,
  // deployed_by, protocol_config_provider, custom_sybil_checks, custom_min_threshold_score
}: PotConfig): Partial<PotSettings> => {
  return evolve(
    {
      chef: chef ?? undefined,
      registry_provider: registry_provider ?? undefined,
      isPgRegistrationRequired: typeof registry_provider === "string",
      sybil_wrapper_provider: sybil_wrapper_provider ?? undefined,
      isSybilResistanceEnabled: typeof sybil_wrapper_provider === "string",
      owner,
      admins,
      pot_name,
      pot_description,
      max_projects,
      application_start_ms,
      application_end_ms,
      public_round_start_ms,
      public_round_end_ms,
      min_matching_pool_donation_amount,
      referral_fee_matching_pool_basis_points,
      referral_fee_public_round_basis_points,
      chef_fee_basis_points,
    },

    {
      min_matching_pool_donation_amount: yoctoNearToFloat,
    },
  );
};

/**
 * Filters out past dates from settings before submitting to the contract.
 * Past dates cannot be updated, so they should not be sent.
 */
export const filterPastDatesForSubmit = <T extends Partial<PotSettings>>(settings: T): T => {
  const now = Temporal.Now.instant().epochMilliseconds;
  const result = { ...settings };

  if (result.application_start_ms !== undefined && result.application_start_ms <= now) {
    delete result.application_start_ms;
  }

  if (result.application_end_ms !== undefined && result.application_end_ms <= now) {
    delete result.application_end_ms;
  }

  if (result.public_round_start_ms !== undefined && result.public_round_start_ms <= now) {
    delete result.public_round_start_ms;
  }

  if (result.public_round_end_ms !== undefined && result.public_round_end_ms <= now) {
    delete result.public_round_end_ms;
  }

  return result;
};

export const potConfigToPotConfigInputs = ({
  registry_provider,
  sybil_wrapper_provider,
  owner,
  ...potConfig
}: PotConfig): Omit<PotInputs, "source_metadata"> => {
  return {
    ...evolve(potConfig, {
      referral_fee_matching_pool_basis_points: feeBasisPointsToPercents,
      referral_fee_public_round_basis_points: feeBasisPointsToPercents,
      chef_fee_basis_points: feeBasisPointsToPercents,

      min_matching_pool_donation_amount: conditional(
        [isNonNullish, yoctoNearToFloat],
        conditional.defaultCase(() => 0.01),
      ),
    }),

    owner: owner ?? undefined,
    registry_provider: registry_provider ?? undefined,
    isPgRegistrationRequired: typeof registry_provider === "string",
    sybil_wrapper_provider: sybil_wrapper_provider ?? undefined,
    isSybilResistanceEnabled: typeof sybil_wrapper_provider === "string",
  };
};

export const potInputsToPotArgs = ({
  isPgRegistrationRequired,
  isSybilResistanceEnabled,
  ...potInputs
}: PotInputs & { source_metadata: ContractSourceMetadata }): PotArgs =>
  evolve(
    {
      ...potInputs,

      registry_provider: isPgRegistrationRequired
        ? LISTS_CONTRACT_ACCOUNT_ID + PROVIDER_ID_DELIMITER + "is_registered"
        : undefined,

      sybil_wrapper_provider: isSybilResistanceEnabled
        ? SYBIL_CONTRACT_ACCOUNT_ID + PROVIDER_ID_DELIMITER + "is_human"
        : undefined,

      referral_fee_matching_pool_basis_points:
        potInputs.referral_fee_matching_pool_basis_points ?? 0,
      referral_fee_public_round_basis_points: potInputs.referral_fee_public_round_basis_points ?? 0,
      chef_fee_basis_points: potInputs.chef_fee_basis_points ?? 0,
    },

    {
      application_start_ms: timestamp.parse,
      application_end_ms: timestamp.parse,
      public_round_start_ms: timestamp.parse,
      public_round_end_ms: timestamp.parse,

      min_matching_pool_donation_amount: conditional(
        [isNonNullish, piped(safePositiveNumber.parse, floatToYoctoNear)],
        conditional.defaultCase(() => undefined),
      ),
    },
  );

export const potIndexedFieldToString = (
  key: PotConfigurationParameterKey,
  value: Pot[keyof Pot],
  { subtitle }: PotConfigurationParameter,
): null | string => {
  switch (typeof value) {
    case "boolean": {
      return value ? (subtitle ?? null) : "No";
    }

    case "number": {
      if (key.includes("fee")) {
        return `${feeBasisPointsToPercents(value)} %`;
      } else return value === 0 ? null : value.toLocaleString();
    }

    case "string": {
      if (key.includes("ms")) {
        return Temporal.Instant.from(value).toLocaleString();
      } else if (key.includes("provider")) {
        return typeof value === "string" ? (subtitle ?? null) : "No";
      } else {
        switch (key) {
          case "min_matching_pool_donation_amount":
            return `${yoctoNearToFloat(value)} ${NATIVE_TOKEN_ID.toUpperCase()}`;

          default:
            return value;
        }
      }
    }

    case "object": {
      if (value === null) {
        return value;
      } else if (Array.isArray(value)) {
        return value.filter(isNonNullish).join(", ");
      } else {
        switch (key) {
          case "chef":
            return (value as Account).id;

          default:
            return value.toString();
        }
      }
    }

    default:
      return null;
  }
};
