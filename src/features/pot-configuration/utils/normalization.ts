import { conditional, evolve, isNonNullish, piped } from "remeda";
import { Temporal } from "temporal-polyfill";

import { LISTS_CONTRACT_ACCOUNT_ID, SYBIL_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { Account, Pot } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID, PROVIDER_ID_DELIMITER } from "@/common/constants";
import { PotConfig } from "@/common/contracts/core/pot";
import { type ContractSourceMetadata, type PotArgs } from "@/common/contracts/core/pot-factory";
import { feeBasisPointsToPercents, feePercentsToBasisPoints } from "@/common/contracts/core/utils";
import { floatToYoctoNear, safePositiveNumber, timestamp, yoctoNearToFloat } from "@/common/lib";
import { PotInputs } from "@/entities/pot";

import { PotSettings } from "../model";
import { PotConfigurationParameter, PotConfigurationParameterKey } from "../types";

export const potConfigToSettings = ({
  chef,
  registry_provider,
  sybil_wrapper_provider,
  ...config
}: PotConfig): Partial<PotSettings> =>
  evolve(
    {
      chef: chef ?? undefined,
      registry_provider: registry_provider ?? undefined,
      isPgRegistrationRequired: typeof registry_provider === "string",
      sybil_wrapper_provider: sybil_wrapper_provider ?? undefined,
      isSybilResistanceEnabled: typeof sybil_wrapper_provider === "string",
      ...config,
    },

    {
      min_matching_pool_donation_amount: yoctoNearToFloat,
    },
  );

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
