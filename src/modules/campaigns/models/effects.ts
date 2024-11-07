import {
  ExecutionStatus,
  ExecutionStatusBasic,
} from "near-api-js/lib/providers/provider";

import { nearRpc, walletApi } from "@/common/api/near";
import { AppDispatcher } from "@/store";

import { CampaignEnumType } from "../types";

export const effects = (dispatch: AppDispatcher) => ({
  handleCampaignContractActions: async (
    transactionHash: string,
  ): Promise<void> => {
    const { accountId: owner_account_id } = walletApi;
    if (owner_account_id) {
      nearRpc.txStatus(transactionHash, owner_account_id).then((response) => {
        const method =
          response.transaction?.actions[0]?.FunctionCall?.method_name;
        let status;
        let type;

        switch (method) {
          case "create_campaign": {
            type = CampaignEnumType.CREATE_CAMPAIGN;
            break;
          }
          case "update_campaign": {
            type = CampaignEnumType.UPDATE_CAMPAIGN;
            break;
          }
          case "delete_campaign": {
            type = CampaignEnumType.DELETE_CAMPAIGN;
            break;
          }
          default: {
            type = CampaignEnumType.NONE;
            break;
          }
        }
        for (let i = 0; i <= 6; i++) {
          status = response.receipts_outcome.at(i)?.outcome?.status;

          if (
            status &&
            typeof status !== "string" &&
            typeof status?.SuccessValue === "string" &&
            status?.SuccessValue
          ) {
            break;
          }
        }

        if (typeof status === "string") {
          switch (status) {
            case ExecutionStatusBasic.Failure: {
              throw new Error("Unable to Update this List");
            }

            default: {
              throw "Unable to Update Campaign";
            }
          }
        } else if (typeof status?.SuccessValue === "string") {
          try {
            dispatch.campaignEditor.deploymentSuccess({
              data: JSON.parse(atob(status.SuccessValue)),
              type,
            });
          } catch (error) {
            console.error("Error parsing JSON:", error);
            // Handle the error appropriately, e.g., dispatch an error action or show a notification
            throw "Unable to Update Campaign: Invalid JSON input";
          }
        } else {
          throw "Unable to Update Campaign";
        }
      });
    }
  },
});
