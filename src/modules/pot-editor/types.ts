import { Pot } from "@/common/api/indexer";
import { PotData, PotInputs } from "@/modules/pot";

export type PotEditorStep = "configuration" | "result";

export type PotEditorState = {
  currentStep: PotEditorStep;

  finalOutcome: {
    data?: null | PotData;
    error: null | Error;
  };
};

export type PotEditorFieldKey = keyof Omit<
  PotInputs,
  "cooldown_period_ms" | "source_metadata"
>;

export type PotEditorField = {
  index?: keyof Pot;
  title: string;
  subtitle?: string;
};

export type PotEditorFieldRegistry = Record<PotEditorFieldKey, PotEditorField>;
