import { ExecutionStatusBasic } from "near-api-js/lib/providers/provider";
import { conditional, evolve, isNonNullish, piped } from "remeda";

import { nearRpc, walletApi } from "@/common/api/near";
import {
  LISTS_CONTRACT_ID,
  PROVIDER_ID_DELIMITER,
  SYBIL_CONTRACT_ID,
} from "@/common/constants";
import {
  PotDeploymentResult,
  pot,
  potFactory,
} from "@/common/contracts/potlock";
import { floatToYoctoNear, timestamp } from "@/common/lib";
import { donationAmount } from "@/modules/donation";
import { PotInputs } from "@/modules/pot";
import { RootDispatcher } from "@/store";

const UnknownDeploymentStatusError = new Error(
  "Unable to get pot deployment status.",
);

export const effects = (dispatch: RootDispatcher) => ({
  deployPot: async ({
    pot_handle,
    source_metadata: { commit_hash, ...sourceMetadata },
    isNadabotVerificationRequired,
    isPgRegistrationRequired,
    ...potInputs
  }: PotInputs): Promise<void> => {
    if (commit_hash === null) {
      return void dispatch.potEditor.deploymentFailure(
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
        .then(dispatch.potEditor.handleDeploymentSuccess)
        .catch(dispatch.potEditor.deploymentFailure);
    }
  },

  handleDeploymentOutcome: async (transactionHash: string): Promise<void> => {
    const { accountId: owner_account_id } = walletApi;

    if (owner_account_id) {
      nearRpc
        .txStatus(transactionHash, owner_account_id)
        .then((response) => {
          const { status } = response.receipts_outcome.at(5)?.outcome ?? {};

          if (typeof status === "string") {
            switch (status) {
              case ExecutionStatusBasic.Failure: {
                throw UnknownDeploymentStatusError;
              }

              default: {
                throw UnknownDeploymentStatusError;
              }
            }
          } else if (typeof status?.SuccessValue === "string") {
            dispatch.potEditor.handleDeploymentSuccess(
              JSON.parse(atob(status.SuccessValue)) as PotDeploymentResult,
            );
          } else {
            throw UnknownDeploymentStatusError;
          }
        })
        .catch(dispatch.potEditor.deploymentFailure);
    } else {
      dispatch.potEditor.deploymentFailure(
        new Error(
          "Unable to get pot deployment status without user authentication. " +
            "Please login and try again.",
        ),
      );
    }
  },

  handleDeploymentSuccess: ({ id }: PotDeploymentResult): void =>
    void pot
      .getConfig({ potId: id })
      .then((potConfig) =>
        dispatch.potEditor.deploymentSuccess({ id, ...potConfig }),
      ),
});