import { infer as FromSchema } from "zod";

import { futureTimestamp } from "@/common/lib";
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

export type PotEditorDeploymentInputs = FromSchema<
  typeof potEditorSettingsSchema
>;

export const potEditorDeploymentCrossFieldValidationTargets: (keyof PotEditorDeploymentInputs)[] =
  ["application_end_ms", "public_round_end_ms", "public_round_start_ms"];

export const potEditorSettingsSchema = potSchema
  .extend({
    application_start_ms: futureTimestamp
      .optional()
      .describe("Application start timestamp."),

    application_end_ms: futureTimestamp
      .optional()
      .describe("Application end timestamp."),
  })
  /**
   *! Heads up!
   *!  Make sure that any fields targeted here are listed in
   *!  `potEditorSettingsCrossFieldValidationTargets`
   *!  and have their corresponding error paths specified correctly.
   */
  .refine(isPotPublicRoundStartAfterApplicationEnd, {
    message: "Public round can only start after application period ends.",
    path: ["public_round_start_ms"],
  })
  .refine(isPotPublicRoundStartBeforeEnd, {
    message: "Public round cannot end before it starts.",
    path: ["public_round_end_ms"],
  });

export type PotEditorSettings = FromSchema<typeof potEditorSettingsSchema>;

export const potEditorSettingsCrossFieldValidationTargets: (keyof PotEditorSettings)[] =
  ["public_round_start_ms", "public_round_end_ms"];
