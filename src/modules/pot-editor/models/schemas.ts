import { Pot } from "@/common/api/potlock";
import { localeStringToTimestampMs, timestamp } from "@/common/lib";
import { FromSchema } from "@/common/types";
import {
  isPotApplicationStartBeforeEnd,
  isPotPublicRoundStartAfterApplicationEnd,
  isPotPublicRoundStartBeforeEnd,
  potSchema,
} from "@/modules/pot";

export const potEditorDeploymentSchema = potSchema
  /**
   *! Heads up!
   *!  Make sure that any fields targeted here are listed in
   *!  `potEditorDeploymentCrossFieldValidationTargets`
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

export const getPotEditorDeploymentSchema = () => potEditorDeploymentSchema;

export type PotEditorDeploymentSchema = ReturnType<
  typeof getPotEditorDeploymentSchema
>;

export type PotEditorDeploymentInputs = FromSchema<PotEditorDeploymentSchema>;

export const potEditorDeploymentCrossFieldValidationTargets: (keyof PotEditorDeploymentInputs)[] =
  ["application_end_ms", "public_round_end_ms", "public_round_start_ms"];

export const getPotEditorSettingsSchema = (potIndexedData?: Pot) => {
  const schema =
    potIndexedData === undefined
      ? potSchema
      : potSchema.extend({
          application_start_ms: timestamp
            .describe("Application period start timestamp.")
            .refine(
              (value) => {
                console.log("Indexed value", potIndexedData?.application_start);
                console.log("Form value", value);

                console.log(
                  "Difference in hours",
                  (localeStringToTimestampMs(potIndexedData.application_start) -
                    value) /
                    1000 /
                    60 /
                    60,
                );

                return (
                  value >=
                  localeStringToTimestampMs(potIndexedData.application_start)
                );
              },

              {
                message: "Cannot be earlier than the date set upon deployment.",
              },
            ),

          application_end_ms: timestamp
            .describe("Application period end timestamp.")
            .refine(
              (value) =>
                value >=
                localeStringToTimestampMs(potIndexedData.application_end),
              {
                message: "Cannot be earlier than the date set upon deployment.",
              },
            ),

          public_round_start_ms: timestamp
            .describe("Matching round start timestamp.")
            .refine(
              (value) =>
                value >=
                localeStringToTimestampMs(potIndexedData.matching_round_start),

              {
                message: "Cannot be earlier than the date set upon deployment.",
              },
            ),

          public_round_end_ms: timestamp
            .describe("Matching round end timestamp.")
            .refine(
              (value) =>
                value >=
                localeStringToTimestampMs(potIndexedData.matching_round_end),
              {
                message: "Cannot be earlier than the date set upon deployment.",
              },
            ),
        });

  /**
   *! Heads up!
   *!  Make sure that any fields targeted here are listed in
   *!  `potEditorSettingsCrossFieldValidationTargets`
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

export type PotEditorSettingsSchema = ReturnType<
  typeof getPotEditorSettingsSchema
>;

export type PotEditorSettings = FromSchema<PotEditorSettingsSchema>;

export const potEditorSettingsCrossFieldValidationTargets: (keyof PotEditorSettings)[] =
  [...potEditorDeploymentCrossFieldValidationTargets];
