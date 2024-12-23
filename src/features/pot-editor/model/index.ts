import { createModel } from "@rematch/core";
import { merge, mergeAll, prop } from "remeda";

import { PotData } from "@/entities/pot";
import { useGlobalStoreSelector } from "@/store";
import { AppModel } from "@/store/models";

import { effects } from "./effects";
import { PotEditorState, PotEditorStep } from "../types";

export * from "./schemas";

export const potEditorModelKey = "potEditor";

export const usePotEditorState = () => useGlobalStoreSelector(prop(potEditorModelKey));

const potEditorStateDefaults: PotEditorState = {
  currentStep: "configuration",
  finalOutcome: { error: null },
};

const handleStep = (
  state: PotEditorState,
  step: PotEditorStep,
  stateUpdate?: Partial<PotEditorState>,
) => mergeAll([state, stateUpdate ?? {}, { currentStep: step }]);

export const potEditorModel = createModel<AppModel>()({
  state: potEditorStateDefaults,
  effects,

  reducers: {
    reset: () => potEditorStateDefaults,

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
