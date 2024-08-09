import { createModel } from "@rematch/core";
import { evolve, pipe } from "rambda";

import { walletApi } from "@/common/contracts";
import {
  Pot,
  PotDeploymentArgs,
} from "@/common/contracts/potlock/interfaces/pot-factory.interfaces";
import { floatToYoctoNear, timestamp } from "@/common/lib";
import { getTransactionStatus } from "@/common/services";
import { donationAmount, donationFeeBasicPoints } from "@/modules/donation";
import { RootModel } from "@/store/models";

import { PotDeploymentInputs } from "./schemas";
import { PotDeploymentStep, PotState } from "../types";

export * from "./schemas";

const potDeploymentStateDefaults: PotState["deployment"] = {
  currentStep: "configuration",
};

const potStateDefaults: PotState = {
  deployment: potDeploymentStateDefaults,
};

const handleDeploymentStep = (state: PotState, step: PotDeploymentStep) => ({
  ...state,
  deployment: { ...state.deployment, currentStep: step },
});

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
        successResult: result,
      };
    },

    deploymentFailure(_, error: Error) {
      console.error(error);
    },
  },

  effects: (dispatch) => ({
    async deploy({
      pot_handle,

      ...params
    }: PotDeploymentInputs): Promise<void> {
      const args: PotDeploymentArgs = {
        pot_args: evolve(
          {
            application_start_ms: timestamp.parse,
            application_end_ms: timestamp.parse,
            public_round_start_ms: timestamp.parse,
            public_round_end_ms: timestamp.parse,

            referral_fee_matching_pool_basis_points:
              donationFeeBasicPoints.parse,

            referral_fee_public_round_basis_points:
              donationFeeBasicPoints.parse,

            min_matching_pool_donation_amount: pipe(
              donationAmount.parse,
              floatToYoctoNear,
            ),
          },

          {
            ...params,

            source_metadata: {
              version: "1.0.0",
              commit_hash: "0x0000000000000000000000000000000000000000",
              link: "0x0000000000000000000000000000000000000000",
            },
          },
        ),

        pot_handle,
      };

      console.log("args", args);

      // return void deploy(args)
      //   .then((result) => dispatch.pot.deploymentSuccess(result))
      //   .catch((error) => dispatch.pot.deploymentFailure(error));
    },

    async handleSuccessByTxHash(transactionHash: string) {
      const { accountId: sender_account_id } = walletApi;

      if (sender_account_id) {
        const { data } = await getTransactionStatus({
          tx_hash: transactionHash,
          sender_account_id,
        });

        const potDeploymentResult = JSON.parse(
          atob(data.result.receipts_outcome[3].outcome.status.SuccessValue),
        ) as Pot;

        return void dispatch.pot.deploymentSuccess(potDeploymentResult);
      } else {
        return void dispatch.pot.deploymentFailure(
          new Error(
            "Unable to get pot deployment status without user authentication." +
              "Please login and try again.",
          ),
        );
      }
    },
  }),
});
