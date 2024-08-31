import { createModel } from "@rematch/core";
import { ExecutionStatusBasic } from "near-api-js/lib/providers/provider";

import { nearRpc, walletApi } from "@/common/api/near";
import { Pot } from "@/common/contracts/potlock/interfaces/pot-factory.interfaces";
import { RootModel } from "@/store/models";

import {
  attachDeploymentEffect,
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
    deploy: attachDeploymentEffect(dispatch),

    async handleDeploymentOutcome(transactionHash: string) {
      const { accountId: sender_account_id } = walletApi;

      if (sender_account_id) {
        const { receipts_outcome } = await nearRpc.txStatus(
          transactionHash,
          sender_account_id,
        );

        const { status } = receipts_outcome.at(5)?.outcome ?? {};

        if (typeof status === "string") {
          switch (status) {
            case ExecutionStatusBasic.Failure: {
              return void dispatch.pot.deploymentFailure(
                new Error("Unable to get pot deployment status."),
              );
            }
          }
        } else if (typeof status?.SuccessValue === "string") {
          const potData = JSON.parse(atob(status.SuccessValue)) as Pot;

          console.log(potData);

          return void dispatch.pot.deploymentSuccess(potData);
        }
      } else {
        return void dispatch.pot.deploymentFailure(
          new Error(
            "Unable to get pot deployment status without user authentication. " +
              "Please login and try again.",
          ),
        );
      }
    },
  }),
});
