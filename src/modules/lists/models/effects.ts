import { ExecutionStatusBasic } from "near-api-js/lib/providers/provider";

import { List } from "@/common/api/indexer";
import { nearRpc, walletApi } from "@/common/api/near";
import { AppDispatcher } from "@/store";

import { ListFormModalType } from "../types";

export const effects = (dispatch: AppDispatcher) => ({
  handleListContractActions: async (transactionHash: string): Promise<void> => {
    const { accountId: owner_account_id } = walletApi;
    if (owner_account_id) {
      nearRpc.txStatus(transactionHash, owner_account_id).then((response) => {
        const method =
          response.transaction?.actions[0]?.FunctionCall?.method_name;
        const { status } =
          response.receipts_outcome.at(method === "donate" ? 6 : 0)?.outcome ??
          {};
        let type: ListFormModalType = ListFormModalType.NONE;
        switch (method) {
          case "create_list": {
            type = ListFormModalType.CREATE_LIST;
            break;
          }
          case "create_list_with_registrations": {
            type = ListFormModalType.CREATE_LIST;
            break;
          }
          case "update_list": {
            type = ListFormModalType.UPDATE_LIST;
            break;
          }
          case "owner_add_admins": {
            type = ListFormModalType.ADD_ADMINS;
            break;
          }
          case "donate": {
            type = ListFormModalType.LIST_DONATION;
            break;
          }
          case "owner_change_owner": {
            type = ListFormModalType.TRANSFER_OWNER;
            break;
          }
          case "delete_list": {
            type = ListFormModalType.DELETE_LIST;
            break;
          }
          default: {
            type = ListFormModalType.NONE;
            break;
          }
        }

        if (typeof status === "string") {
          switch (status) {
            case ExecutionStatusBasic.Failure: {
              throw new Error("Unable to Update this List");
            }

            default: {
              throw "Unable to Update List";
            }
          }
        } else if (typeof status?.SuccessValue === "string") {
          try {
            dispatch.listEditor.deploymentSuccess({
              data:
                type === ListFormModalType.DELETE_LIST
                  ? undefined
                  : (JSON.parse(atob(status.SuccessValue)) as List),
              type,
              ...(type === ListFormModalType.TRANSFER_OWNER && {
                accountId: JSON.parse(atob(status.SuccessValue)) as string,
              }),
            });
          } catch (error) {
            console.error("Error parsing JSON:", error);
            // Handle the error appropriately, e.g., dispatch an error action or show a notification
            throw "Unable to Update List: Invalid JSON input";
          }
        } else {
          throw "Unable to Update List";
        }
      });
    }
  },
});
