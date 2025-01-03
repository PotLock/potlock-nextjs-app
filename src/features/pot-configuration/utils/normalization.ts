import { conditional, evolve, isNonNullish, omit, piped, prop } from "remeda";
import { Temporal } from "temporal-polyfill";

import { LISTS_CONTRACT_ACCOUNT_ID, SYBIL_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { Account, Pot } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID, PROVIDER_ID_DELIMITER } from "@/common/constants";
import { ContractSourceMetadata, PotArgs, PotConfig } from "@/common/contracts/core";
import { floatToYoctoNear, timestamp, yoctoNearToFloat } from "@/common/lib";
import { PotInputs } from "@/entities/pot";
import {
  donationAmount,
  donationFeeBasisPointsToPercents,
  donationFeePercentsToBasisPoints,
} from "@/features/donation";

import { POT_EDITOR_EXCLUDED_INDEXED_PROPERTIES } from "../constants";
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

export const potIndexedDataToPotInputs = ({
  owner,
  admins,
  chef,
  name,
  description,
  max_approved_applicants,
  application_start,
  application_end,
  matching_round_start,
  matching_round_end,
  registry_provider,
  sybil_wrapper_provider,
  ...indexedPotData
}: Pot) => {
  const potData = evolve(indexedPotData, {
    referral_fee_matching_pool_basis_points: donationFeeBasisPointsToPercents,
    referral_fee_public_round_basis_points: donationFeeBasisPointsToPercents,
    chef_fee_basis_points: donationFeeBasisPointsToPercents,

    min_matching_pool_donation_amount: conditional(
      [isNonNullish, yoctoNearToFloat],
      conditional.defaultCase(() => undefined),
    ),
  });

  return omit(
    {
      ...potData,
      owner: owner.id,
      admins: admins.map(prop("id")),
      chef: chef?.id,
      pot_name: name,
      pot_description: description,
      max_projects: max_approved_applicants,

      application_start_ms: Temporal.Instant.from(application_start)
        .toZonedDateTimeISO(Temporal.Now.timeZoneId())
        .toPlainDateTime()
        .toString(),

      application_end_ms: Temporal.Instant.from(application_end)
        .toZonedDateTimeISO(Temporal.Now.timeZoneId())
        .toPlainDateTime()
        .toString(),

      public_round_start_ms: Temporal.Instant.from(matching_round_start)
        .toZonedDateTimeISO(Temporal.Now.timeZoneId())
        .toPlainDateTime()
        .toString(),

      public_round_end_ms: Temporal.Instant.from(matching_round_end)
        .toZonedDateTimeISO(Temporal.Now.timeZoneId())
        .toPlainDateTime()
        .toString(),

      registry_provider: registry_provider ?? undefined,
      isPgRegistrationRequired: typeof registry_provider === "string",
      sybil_wrapper_provider: sybil_wrapper_provider ?? undefined,
      isSybilResistanceEnabled: typeof sybil_wrapper_provider === "string",
    },

    {
      ...POT_EDITOR_EXCLUDED_INDEXED_PROPERTIES,

      ...(potData.min_matching_pool_donation_amount === undefined
        ? ["min_matching_pool_donation_amount"]
        : []),
    },
  );
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
    },

    {
      referral_fee_matching_pool_basis_points: donationFeePercentsToBasisPoints,
      referral_fee_public_round_basis_points: donationFeePercentsToBasisPoints,
      chef_fee_basis_points: donationFeePercentsToBasisPoints,
      application_start_ms: timestamp.parse,
      application_end_ms: timestamp.parse,
      public_round_start_ms: timestamp.parse,
      public_round_end_ms: timestamp.parse,

      min_matching_pool_donation_amount: conditional(
        [isNonNullish, piped(donationAmount.parse, floatToYoctoNear)],
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
        return `${donationFeeBasisPointsToPercents(value)} %`;
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
