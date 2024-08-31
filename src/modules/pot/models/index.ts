import { createModel } from "@rematch/core";
import { prop } from "remeda";

import { Pot } from "@/common/contracts/potlock/interfaces/pot-factory.interfaces";
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
    reset() {
      return potStateDefaults;
    },

    deploymentReset(state) {
      return {
        ...state,
        deployment: potDeploymentStateDefaults,
      };
    },

    nextDeploymentStep(state) {
      switch (state.deployment.currentStep) {
        case "configuration":
          return handleDeploymentStep(state, "success");
      }
    },

    deploymentSuccess(state, result: Pot) {
      return {
        ...handleDeploymentStep(state, "success"),
        finalOutcome: result,
      };
    },

    deploymentFailure(_, error: Error) {
      console.error(error);
      throw error;
    },
  },

  effects: (dispatch) => ({
    submitDeployment: attachDeploymentHandler(dispatch),
    handleDeploymentOutcome: attachDeploymentOutcomeHandler(dispatch),
  }),
});

export const usePotState = () => useTypedSelector(prop("pot"));
