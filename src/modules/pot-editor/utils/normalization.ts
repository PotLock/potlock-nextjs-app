import { conditional, evolve, isNonNullish, omit, piped, prop } from "remeda";

import { Pot } from "@/common/api/potlock";
import {
  LISTS_CONTRACT_ID,
  PROVIDER_ID_DELIMITER,
  SYBIL_CONTRACT_ID,
} from "@/common/constants";
import { ContractSourceMetadata, PotArgs } from "@/common/contracts/potlock";
import { floatToYoctoNear, timestamp, yoctoNearToFloat } from "@/common/lib";
import {
  donationAmount,
  donationFeeBasisPointsToPercents,
} from "@/modules/donation";
import { PotInputs } from "@/modules/pot";

import { POT_EDITOR_EXCLUDED_INDEXED_PROPERTIES } from "../constants";

export const potIndexedDataToPotInputs = ({
  owner,
  admins,
  chef,
  name,
  description,
  max_approved_applicants,
  matching_round_start,
  matching_round_end,
  registry_provider,
  sybil_wrapper_provider,
  min_matching_pool_donation_amount,
  ...indexedPotData
}: Pot): Partial<PotInputs> =>
  omit(
    {
      ...evolve(indexedPotData, {
        referral_fee_matching_pool_basis_points:
          donationFeeBasisPointsToPercents,

        referral_fee_public_round_basis_points:
          donationFeeBasisPointsToPercents,

        chef_fee_basis_points: donationFeeBasisPointsToPercents,
      }),

      owner: owner.id,
      admins: admins.map(prop("id")),
      chef: chef?.id,
      pot_name: name,
      pot_description: description,
      max_projects: max_approved_applicants,
      public_round_start_ms: timestamp.parse(matching_round_start),
      public_round_end_ms: timestamp.parse(matching_round_end),
      registry_provider: registry_provider ?? undefined,
      isPgRegistrationRequired: typeof registry_provider === "string",
      sybil_wrapper_provider: sybil_wrapper_provider ?? undefined,
      isSybilResistanceEnabled: typeof sybil_wrapper_provider === "string",

      min_matching_pool_donation_amount:
        typeof min_matching_pool_donation_amount === "string"
          ? yoctoNearToFloat(min_matching_pool_donation_amount)
          : undefined,
    },

    POT_EDITOR_EXCLUDED_INDEXED_PROPERTIES,
  );

export const potInputsToPotArgs = ({
  isPgRegistrationRequired,
  isSybilResistanceEnabled,
  ...potInputs
}: PotInputs & { source_metadata: ContractSourceMetadata }): PotArgs =>
  evolve(
    {
      ...potInputs,

      registry_provider: isPgRegistrationRequired
        ? LISTS_CONTRACT_ID + PROVIDER_ID_DELIMITER + "is_registered"
        : undefined,

      sybil_wrapper_provider: isSybilResistanceEnabled
        ? SYBIL_CONTRACT_ID + PROVIDER_ID_DELIMITER + "is_human"
        : undefined,
    },

    {
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
  key: keyof Pot,
  value: Pot[keyof Pot],
) => {
  switch (typeof value) {
    case "number":
      return value.toString();
    case "string":
      return value;
    default:
      return undefined;
  }
};
