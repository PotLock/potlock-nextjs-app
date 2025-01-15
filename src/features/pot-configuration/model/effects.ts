import { ExecutionStatusBasic } from "near-api-js/lib/providers/provider";
import { omit } from "remeda";

import { ByPotId } from "@/common/api/indexer";
import { nearRpc, walletApi } from "@/common/api/near/client";
import {
  PotConfig,
  PotDeploymentResult,
  potContractClient,
  potFactoryContractClient,
} from "@/common/contracts/core";
import { AppDispatcher } from "@/store";

import { PotDeploymentInputs, PotSettings } from "./schemas";
import { potInputsToPotArgs } from "../utils/normalization";

const UnknownDeploymentStatusError = new Error("Unable to get pot deployment status.");

type PotConfigurationSaveInputs = (PotDeploymentInputs | PotSettings) &
  Partial<ByPotId> & {
    onDeploymentSuccess: (params: ByPotId) => void;
    onUpdate: (config: PotConfig) => void;
  };

export const effects = (dispatch: AppDispatcher) => ({
  handleDeploymentSuccess: ({ id }: PotDeploymentResult): void =>
    void potContractClient.get_config({ potId: id }).then((potConfig) => {
      dispatch.potConfiguration.deploymentSuccess({ id, ...potConfig });
    }),

  save: async ({
    onDeploymentSuccess,
    onUpdate,
    potId,
    pot_handle,
    source_metadata: { commit_hash, ...sourceMetadata },
    ...potInputs
  }: PotConfigurationSaveInputs): Promise<void> => {
    const isNewPot = typeof potId !== "string";

    if (commit_hash === null) {
      dispatch.potConfiguration.deploymentFailure(
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
        potFactoryContractClient
          .deploy_pot({
            pot_args,
            pot_handle: (pot_handle?.length ?? 0) > 0 ? pot_handle : undefined,
          })
          .then((result) => {
            dispatch.potConfiguration.handleDeploymentSuccess(result);
            onDeploymentSuccess({ potId: result.id });
          })
          .catch(dispatch.potConfiguration.deploymentFailure);
      } else {
        potContractClient
          .admin_dangerously_set_pot_config(potId, {
            update_args: omit(pot_args, ["custom_sybil_checks"]),
          })
          .then(onUpdate)
          .catch(dispatch.potConfiguration.updateFailure);
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
            dispatch.potConfiguration.handleDeploymentSuccess(
              JSON.parse(atob(status.SuccessValue)) as PotDeploymentResult,
            );
          } else {
            throw UnknownDeploymentStatusError;
          }
        })
        .catch(dispatch.potConfiguration.deploymentFailure);
    } else {
      dispatch.potConfiguration.deploymentFailure(
        new Error(
          "Unable to get pot deployment status without user authentication. " +
            "Please login and try again.",
        ),
      );
    }
  },
});
