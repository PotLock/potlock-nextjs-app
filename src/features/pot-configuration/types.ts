import { Pot } from "@/common/api/indexer";
import { PotData, PotInputs } from "@/entities/pot";

export type PotConfigurationStep = "configuration" | "result";

export type PotConfigurationState = {
  currentStep: PotConfigurationStep;

  finalOutcome: {
    data?: null | PotData;
    error: null | Error;
  };
};

export type PotConfigurationParameterKey = keyof Omit<
  PotInputs,
  "cooldown_period_ms" | "source_metadata"
>;

export type PotConfigurationParameter = {
  index?: keyof Pot;
  title: string;
  subtitle?: string;
};

export type PotConfigurationParameters = Record<
  PotConfigurationParameterKey,
  PotConfigurationParameter
>;
