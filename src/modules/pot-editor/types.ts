import { Pot, PotId } from "@/common/api/potlock";
import { PotConfig } from "@/common/contracts/potlock";
import { PotInputs } from "@/modules/pot";

export type PotEditorDeploymentStep = "configuration" | "result";

export type PotEditorState = {
  currentStep: PotEditorDeploymentStep;

  finalOutcome: {
    data?: null | (PotConfig & { id: PotId });
    error: null | Error;
  };
};

export type PotEditorFieldKey = keyof Omit<
  PotInputs,
  | "cooldown_period_ms"
  | "registry_provider"
  | "sybil_wrapper_provider"
  | "source_metadata"
>;

export type PotEditorField = {
  index?: keyof Pot;
  title: string;
  subtitle?: string;
};

export type PotEditorFieldRegistry = Record<PotEditorFieldKey, PotEditorField>;
