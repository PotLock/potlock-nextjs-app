import { createModel } from "@rematch/core";
import { merge, mergeAll, prop } from "remeda";

import { PotDeploymentResult } from "@/common/contracts/potlock";
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

    deploymentSuccess: (state, data: PotDeploymentResult) =>
      handleDeploymentStep(state, "result", { finalOutcome: { data } }),

    deploymentFailure: (state, error: Error) =>
      handleDeploymentStep(state, "result", { finalOutcome: { error } }),
  },
});
