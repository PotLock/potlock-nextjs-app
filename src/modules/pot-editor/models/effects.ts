import { ExecutionStatusBasic } from "near-api-js/lib/providers/provider";
import { omit } from "remeda";

import { nearRpc, walletApi } from "@/common/api/near";
import { ByPotId } from "@/common/api/potlock";
import {
  PotDeploymentResult,
  pot,
  potFactory,
} from "@/common/contracts/potlock";
import { PotInputs } from "@/modules/pot";
import { PotEditorDeploymentInputs } from "@/modules/pot-editor/models/schemas";
import { RootDispatcher } from "@/store";

import { potInputsToPotArgs } from "../utils/normalization";

const UnknownDeploymentStatusError = new Error(
  "Unable to get pot deployment status.",
);

export const effects = (dispatch: RootDispatcher) => ({
  save: async ({
    potId,
    pot_handle,
    source_metadata: { commit_hash, ...sourceMetadata },
    ...potInputs
  }: PotInputs & Partial<ByPotId>): Promise<void> => {
    const isNewPot = typeof potId !== "string";

    if (commit_hash === null) {
      dispatch.potEditor.deploymentFailure(
        new Error(
          "Unable to retrieve pot contract source code commit hash. " +
            "Please check your internet connection and reload the page.",
        ),
      );
    } else {
      const pot_args = potInputsToPotArgs({
        ...potInputs,
        source_metadata: { commit_hash, ...sourceMetadata },
      });

      if (isNewPot) {
        console.log(pot_args);

        potFactory
          .deploy_pot({
            pot_args,
            pot_handle,
          })
          .then(dispatch.potEditor.handleDeploymentSuccess)
          .catch(dispatch.potEditor.deploymentFailure);
      } else {
        console.log(omit(pot_args, ["custom_sybil_checks"]));

        pot.admin_dangerously_set_pot_config(potId, {
          update_args: omit(pot_args, ["custom_sybil_checks"]),
        });
      }
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
