import { createModel } from "@rematch/core";
import { ExecutionStatusBasic } from "near-api-js/lib/providers/provider";
import { conditional, evolve, isNonNullish, piped } from "remeda";

import { nearRpc, walletApi } from "@/common/api/near";
import {
  LISTS_CONTRACT_ID,
  PROVIDER_ID_DELIMITER,
  SYBIL_CONTRACT_ID,
} from "@/common/constants";
import { potFactory } from "@/common/contracts/potlock";
import { Pot } from "@/common/contracts/potlock/interfaces/pot-factory.interfaces";
import { floatToYoctoNear, timestamp } from "@/common/lib";
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
      throw error;
    },
  },

  effects: (dispatch) => ({
    async deploy({
      pot_handle,
      source_metadata: { commit_hash, ...sourceMetadata },
      isNadabotVerificationRequired,
      isPgRegistrationRequired,
      ...potInputs
    }: PotDeploymentInputs): Promise<void> {
      if (commit_hash === null) {
        return void dispatch.pot.deploymentFailure(
          new Error(
            "Unable to retrieve pot contract source code commit hash. " +
              "Please check your internet connection and reload the page.",
          ),
        );
      } else {
        return void potFactory
          .deploy_pot({
            // pot_args: evolve(
            //   {
            //     ...potInputs,
            //     source_metadata: { commit_hash, ...sourceMetadata },

            //     registry_provider: isPgRegistrationRequired
            //       ? LISTS_CONTRACT_ID
            //       : undefined,

            //     sybil_wrapper_provider: isNadabotVerificationRequired
            //       ? SYBIL_CONTRACT_ID + PROVIDER_ID_DELIMITER + "is_human"
            //       : undefined,
            //   },

            //   {
            //     application_start_ms: timestamp.parse,
            //     application_end_ms: timestamp.parse,
            //     public_round_start_ms: timestamp.parse,
            //     public_round_end_ms: timestamp.parse,

            //     referral_fee_matching_pool_basis_points:
            //       donationFeeBasicPoints.parse,

            //     referral_fee_public_round_basis_points:
            //       donationFeeBasicPoints.parse,

            //     min_matching_pool_donation_amount: conditional(
            //       [isNonNullish, piped(donationAmount.parse, floatToYoctoNear)],
            //       conditional.defaultCase(() => undefined),
            //     ),

            //     chef_fee_basis_points: donationFeeBasicPoints.parse,
            //   },
            // ),

            pot_args: {
              owner: "root.akaia.testnet",
              pot_name: "AKAIA stuff",
              pot_description: "test",
              max_projects: 25,
              application_start_ms: 1727359500000,
              application_end_ms: 1729951500000,
              public_round_start_ms: 1732629900000,
              public_round_end_ms: 1735221960000,
              referral_fee_matching_pool_basis_points: 50000,
              referral_fee_public_round_basis_points: 50000,
              chef_fee_basis_points: 10000,
              sybil_wrapper_provider: "v1.nadabot.testnet:is_human",

              source_metadata: {
                commit_hash: "cda438fd3f7a0aea06a4e435d7ecebfeb6e172a5",
                link: "https://github.com/PotLock/core",
                version: "0.1.0",
              },
            },

            pot_handle,
          })
          .then(dispatch.pot.deploymentSuccess)
          .catch(dispatch.pot.deploymentFailure);
      }
    },

    async handleDeploymentOutcomeByTxHash(transactionHash: string) {
      const { accountId: sender_account_id } = walletApi;

      if (sender_account_id) {
        const { receipts_outcome } = await nearRpc.txStatus(
          transactionHash,
          sender_account_id,
        );

        const { status: txStatus } = receipts_outcome.at(3)?.outcome ?? {};

        if (typeof txStatus === "string") {
          switch (txStatus) {
            case ExecutionStatusBasic.Failure: {
              return void dispatch.pot.deploymentFailure(
                new Error("Unable to get pot deployment status."),
              );
            }
          }
        } else if (typeof txStatus?.SuccessValue === "string") {
          const potDeploymentResult = JSON.parse(
            atob(txStatus.SuccessValue),
          ) as Pot;

          return void dispatch.pot.deploymentSuccess(potDeploymentResult);
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
