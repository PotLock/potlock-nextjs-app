import { ExecutionStatusBasic } from "near-api-js/lib/providers/provider";
import {
  conditional,
  evolve,
  isNonNullish,
  merge,
  mergeAll,
  piped,
} from "remeda";

import { nearRpc, walletApi } from "@/common/api/near";
import {
  LISTS_CONTRACT_ID,
  PROVIDER_ID_DELIMITER,
  SYBIL_CONTRACT_ID,
} from "@/common/constants";
import { potFactory } from "@/common/contracts/potlock";
import { PotDeploymentResult } from "@/common/contracts/potlock/interfaces/pot-factory.interfaces";
import { floatToYoctoNear, timestamp } from "@/common/lib";
import { donationAmount } from "@/modules/donation";
import { RootDispatcher } from "@/store";

import { PotDeploymentInputs } from "./schemas";
import { PotDeploymentStep, PotState } from "../types";

export const potDeploymentStateDefaults: PotState["deployment"] = {
  currentStep: "configuration",
  finalOutcome: {},
};

export const handleDeploymentStep = (
  state: PotState,
  step: PotDeploymentStep,
  deploymentStateUpdate?: Partial<PotState["deployment"]>,
) =>
  merge(state, {
    deployment: mergeAll([
      state.deployment,
      deploymentStateUpdate ?? {},
      { currentStep: step },
    ]),
  });

export const attachDeploymentHandler =
  (dispatch: RootDispatcher) =>
  async ({
    pot_handle,
    source_metadata: { commit_hash, ...sourceMetadata },
    isNadabotVerificationRequired,
    isPgRegistrationRequired,
    ...potInputs
  }: PotDeploymentInputs): Promise<void> => {
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
          pot_args: evolve(
            {
              ...potInputs,
              source_metadata: { commit_hash, ...sourceMetadata },

              registry_provider: isPgRegistrationRequired
                ? LISTS_CONTRACT_ID + PROVIDER_ID_DELIMITER + "is_registered"
                : undefined,

              sybil_wrapper_provider: isNadabotVerificationRequired
                ? SYBIL_CONTRACT_ID + PROVIDER_ID_DELIMITER + "is_human"
                : undefined,
            },

            {
              application_start_ms: timestamp.parse,
              application_end_ms: timestamp.parse,
              public_round_start_ms: timestamp.parse,
              public_round_end_ms: timestamp.parse,

              min_matching_pool_donation_amount: conditional(
                [isNonNullish, piped(donationAmount.parse, floatToYoctoNear)],
                conditional.defaultCase(() => undefined),
              ),
            },
          ),

          pot_handle,
        })
        .then(dispatch.pot.deploymentSuccess)
        .catch(dispatch.pot.deploymentFailure);
    }
  };

export const attachDeploymentOutcomeHandler =
  (dispatch: RootDispatcher) =>
  async (transactionHash: string): Promise<void> => {
    const { accountId: owner_account_id } = walletApi;

    if (owner_account_id) {
      const { receipts_outcome } = await nearRpc.txStatus(
        transactionHash,
        owner_account_id,
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
        const potData = JSON.parse(
          atob(status.SuccessValue),
        ) as PotDeploymentResult;

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
  };
