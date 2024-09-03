import { createModel } from "@rematch/core";
import { merge, mergeAll, prop } from "remeda";

import { PotData } from "@/modules/pot";
import { useTypedSelector } from "@/store";
import { RootModel } from "@/store/models";

import { effects } from "./effects";
import { PotDeploymentStep, PotEditorState } from "../types";

export const potEditorModelKey = "potEditor";

export const usePotEditorState = () =>
  useTypedSelector(prop(potEditorModelKey));

const potDeploymentStateDefaults: PotEditorState = {
  currentStep: "configuration",
  finalOutcome: {},
};

const handleDeploymentStep = (
  state: PotEditorState,
  step: PotDeploymentStep,
  deploymentStateUpdate?: Partial<PotEditorState>,
) => mergeAll([state, deploymentStateUpdate ?? {}, { currentStep: step }]);

export const potEditorModel = createModel<RootModel>()({
  state: potDeploymentStateDefaults,
  effects,

  reducers: {
    reset: () => potDeploymentStateDefaults,

    deploymentReset: (state) =>
      merge(state, {
        deployment: potDeploymentStateDefaults,
      }),

    nextDeploymentStep(state) {
      switch (state.currentStep) {
        case "configuration":
          return handleDeploymentStep(state, "result");
      }
    },

    deploymentSuccess: (state, data: PotData) =>
      handleDeploymentStep(state, "result", {
        finalOutcome: { data, error: null },
      }),

    deploymentFailure: (state, error: Error) =>
      handleDeploymentStep(state, "result", {
        finalOutcome: { data: null, error },
      }),
  },
});
