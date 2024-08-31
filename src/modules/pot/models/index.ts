import { createModel } from "@rematch/core";
import { merge, prop } from "remeda";

import { PotDeploymentResult } from "@/common/contracts/potlock";
import { useTypedSelector } from "@/store";
import { RootModel } from "@/store/models";

import {
  attachDeploymentHandler,
  attachDeploymentOutcomeHandler,
  handleDeploymentStep,
  potDeploymentStateDefaults,
} from "./deployment";
import { PotState } from "../types";

export * from "./schemas";

const potStateDefaults: PotState = {
  deployment: potDeploymentStateDefaults,
};

export const potModel = createModel<RootModel>()({
  state: potStateDefaults,

  reducers: {
    reset: () => potStateDefaults,

    deploymentReset: (state) =>
      merge(state, {
        deployment: potDeploymentStateDefaults,
      }),

    nextDeploymentStep(state) {
      switch (state.deployment.currentStep) {
        case "configuration":
          return handleDeploymentStep(state, "result");
      }
    },

    deploymentSuccess: (state, data: PotDeploymentResult) =>
      handleDeploymentStep(state, "result", { finalOutcome: { data } }),

    deploymentFailure: (state, error: Error) =>
      handleDeploymentStep(state, "result", { finalOutcome: { error } }),
  },

  effects: (dispatch) => ({
    submitDeployment: attachDeploymentHandler(dispatch),
    handleDeploymentOutcome: attachDeploymentOutcomeHandler(dispatch),
  }),
});

export const usePotState = () => useTypedSelector(prop("pot"));
