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
     *!  `potDeploymentDependentFields`
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

export const potDeploymentDependentFields: (keyof PotDeploymentInputs)[] = [
  "application_end_ms",
  "public_round_end_ms",
  "public_round_start_ms",
];

/**
 * Schema for updating pot settings.
 * Uses regular timestamp validation (no "must be in future" requirement).
 * Past dates are filtered out when submitting, not in the form.
 * Cross-field validation (end after start) is still enforced.
 */
export const getPotSettingsSchema = (_potIndexedData?: Pot) => {
  // For updates, use timestamp (not futureTimestamp) - no "must be in future" validation
  const schema = potSchema.extend({
    application_start_ms: timestamp.describe("Application period start timestamp."),
    application_end_ms: timestamp.describe("Application period end timestamp."),
    public_round_start_ms: timestamp.describe("Matching round start timestamp."),
    public_round_end_ms: timestamp.describe("Matching round end timestamp."),
  });

  // Keep cross-field validation (end cannot be before start)
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

export const potSettingsDependentFields: (keyof PotSettings)[] = [
  "application_end_ms",
  "public_round_end_ms",
  "public_round_start_ms",
];
