import { createModel } from "@rematch/core";
import { merge, mergeAll, prop } from "remeda";

import { PotData } from "@/entities/pot";
import { useGlobalStoreSelector } from "@/store/hooks";
import { type AppModel } from "@/store/models";

import { effects } from "./effects";
import { PotConfigurationState, PotConfigurationStep } from "../types";

export * from "./schemas";

export const potConfigurationModelKey = "potConfiguration";

export const usePotConfigurationState = () =>
  useGlobalStoreSelector(prop(potConfigurationModelKey));

const potConfigurationStateDefaults: PotConfigurationState = {
  currentStep: "configuration",
  finalOutcome: { error: null },
};

const handleStep = (
  state: PotConfigurationState,
  step: PotConfigurationStep,
  stateUpdate?: Partial<PotConfigurationState>,
) => mergeAll([state, stateUpdate ?? {}, { currentStep: step }]);

export const potConfigurationModel = createModel<AppModel>()({
  state: potConfigurationStateDefaults,
  effects,

  reducers: {
    reset: () => potConfigurationStateDefaults,

    deploymentSuccess: (state, data: PotData) =>
      handleStep(state, "result", {
        finalOutcome: { data, error: null },
      }),

    deploymentFailure: (state, error: Error) =>
      handleStep(state, "result", {
        finalOutcome: { data: null, error },
      }),

    updateFailure: (state, error: Error) =>
      merge(state, {
        finalOutcome: { data: null, error },
      }),
  },
});
