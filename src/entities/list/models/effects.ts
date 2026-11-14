import { ExecutionStatusBasic } from "near-api-js/lib/providers/provider";

import { syncApi } from "@/common/api/indexer";
import { nearRpc, walletApi } from "@/common/blockchains/near-protocol/client";
import { AppDispatcher } from "@/store";

import { ListFormModalType } from "../types";

export const effects = (dispatch: AppDispatcher) => ({
  handleListContractActions: async (transactionHash: string): Promise<void> => {
    const { accountId: owner_account_id } = walletApi;

    if (owner_account_id) {
      nearRpc.txStatus(transactionHash, owner_account_id).then(async (response) => {
        const method = response.transaction?.actions[0]?.FunctionCall?.method_name;
        const { status } = response.receipts_outcome.at(method === "donate" ? 6 : 0)?.outcome ?? {};
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

          case "register_batch": {
            type = ListFormModalType.BATCH_REGISTER;
            break;
          }

          case "unregister": {
            type = ListFormModalType.UNREGISTER;
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
            const rawData =
              type === ListFormModalType.DELETE_LIST
                ? undefined
                : JSON.parse(atob(status.SuccessValue));

            // Handle both array and object responses
            const parsedData = Array.isArray(rawData) ? rawData[0] : rawData;

            // Sync list to indexer after successful transaction
            if (parsedData?.id && type !== ListFormModalType.DELETE_LIST) {
              await syncApi.list(parsedData.id).catch(() => {});
            }

            // Sync registrations for registration-related operations
            if (
              type === ListFormModalType.BATCH_REGISTER ||
              type === ListFormModalType.UNREGISTER
            ) {
              const args = response.transaction?.actions[0]?.FunctionCall?.args;

              if (args) {
                try {
                  const decodedArgs = JSON.parse(atob(args));

                  if (decodedArgs?.list_id) {
                    await syncApi.listRegistrations(decodedArgs.list_id).catch(() => {});
                  }
                } catch {
                  // Ignore parse errors
                }
              }
            }

            dispatch.listEditor.deploymentSuccess({
              data: parsedData,
              type,
              ...(type === ListFormModalType.TRANSFER_OWNER && {
                accountId: JSON.parse(atob(status.SuccessValue)) as string,
              }),
            });
          } catch {
            throw "Unable to Update List: Invalid JSON input";
          }
        } else {
          throw "Unable to Update List";
        }
      });
    }
  },
});
