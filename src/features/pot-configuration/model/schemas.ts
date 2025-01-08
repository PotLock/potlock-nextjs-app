import { Temporal } from "temporal-polyfill";

import { Pot } from "@/common/api/indexer";
import { timestamp } from "@/common/lib";
import { FromSchema } from "@/common/types";
import {
  isPotApplicationStartBeforeEnd,
  isPotPublicRoundStartAfterApplicationEnd,
  isPotPublicRoundStartBeforeEnd,
  potSchema,
} from "@/entities/pot";

export const getPotDeploymentSchema = () =>
  potSchema
    /**
     *! Heads up!
     *!  Make sure that any fields targeted here are listed in
     *!  `potDeploymentCrossFieldValidationTargets`
     *!  and have their corresponding error paths specified correctly.
     */
    .refine(isPotApplicationStartBeforeEnd, {
      message: "Application cannot end before it starts.",
      path: ["application_end_ms"],
    })
    .refine(isPotPublicRoundStartAfterApplicationEnd, {
      message: "Public round can only start after application period ends.",
      path: ["public_round_start_ms"],
    })
    .refine(isPotPublicRoundStartBeforeEnd, {
      message: "Public round cannot end before it starts.",
      path: ["public_round_end_ms"],
    });

export type PotDeploymentSchema = ReturnType<typeof getPotDeploymentSchema>;

export type PotDeploymentInputs = FromSchema<PotDeploymentSchema>;

export const potDeploymentCrossFieldValidationTargets: (keyof PotDeploymentInputs)[] = [
  "application_end_ms",
  "public_round_end_ms",
  "public_round_start_ms",
];

export const getPotSettingsSchema = (potIndexedData?: Pot) => {
  const schema =
    potIndexedData === undefined
      ? potSchema
      : potSchema.extend({
          application_start_ms: timestamp.describe("Application period start timestamp.").refine(
            (value) =>
              value >= Temporal.Instant.from(potIndexedData.application_start).epochMilliseconds,

            {
              message: "Cannot be earlier than the date set upon deployment.",
            },
          ),

          application_end_ms: timestamp.describe("Application period end timestamp.").refine(
            (value) =>
              value >= Temporal.Instant.from(potIndexedData.application_end).epochMilliseconds,

            {
              message: "Cannot be earlier than the date set upon deployment.",
            },
          ),

          public_round_start_ms: timestamp.describe("Matching round start timestamp.").refine(
            (value) =>
              value >= Temporal.Instant.from(potIndexedData.matching_round_start).epochMilliseconds,

            {
              message: "Cannot be earlier than the date set upon deployment.",
            },
          ),

          public_round_end_ms: timestamp.describe("Matching round end timestamp.").refine(
            (value) =>
              value >= Temporal.Instant.from(potIndexedData.matching_round_end).epochMilliseconds,

            {
              message: "Cannot be earlier than the date set upon deployment.",
            },
          ),
        });

  /**
   *! Heads up!
   *!  Make sure that any fields targeted here are listed in
   *!  `potSettingsCrossFieldValidationTargets`
   *!  and have their corresponding error paths specified correctly.
   */
  return schema
    .refine(isPotApplicationStartBeforeEnd, {
      message: "Application cannot end before it starts.",
      path: ["application_end_ms"],
    })
    .refine(isPotPublicRoundStartAfterApplicationEnd, {
      message: "Public round can only start after application period ends.",
      path: ["public_round_start_ms"],
    })
    .refine(isPotPublicRoundStartBeforeEnd, {
      message: "Public round cannot end before it starts.",
      path: ["public_round_end_ms"],
    });
};

export type PotSettingsSchema = ReturnType<typeof getPotSettingsSchema>;

export type PotSettings = FromSchema<PotSettingsSchema>;

export const potSettingsCrossFieldValidationTargets: (keyof PotSettings)[] = [
  "application_end_ms",
  "public_round_end_ms",
  "public_round_start_ms",
];
