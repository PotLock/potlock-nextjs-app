import { ChangeEvent, useState } from "react";

import { buildTransaction } from "@wpdas/naxios";
import { useRouter } from "next/router";
import { prop } from "remeda";

import { LISTS_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { naxiosInstance } from "@/common/blockchains/near-protocol/client";
import { listsContractClient } from "@/common/contracts/core/lists";
import { floatToYoctoNear } from "@/common/lib";
import { AccountId } from "@/common/types";
import { AccountGroupItem, validateAccountId } from "@/entities/_shared/account";
import { dispatch } from "@/store";

import { ListFormModalType } from "../types";

export const useListForm = () => {
  const { push, query } = useRouter();
  const [transferAccountField, setTransferAccountField] = useState<string>("");
  const [transferAccountError, setTransferAccountError] = useState<string | undefined>("");

  const [finishModal, setFinishModal] = useState<{
    open: boolean;
    type: ListFormModalType;
  }>({ open: false, type: ListFormModalType.NONE });

  const [admins, setAdmins] = useState<AccountId[]>([]);
  const [accounts, setAccounts] = useState<AccountId[]>([]);
  const id = query.id;

  const description = "You may now close this modal";

  const handleDeleteList = (id: number) => {
    if (!id) return;

    listsContractClient
      .delete_list({ list_id: id })
      .then(() => {
        push("/lists");
      })
      .catch((error) => {
        console.error("Error deleting list", error);
      });

    dispatch.listEditor.updateListModalState({
      header: "List Deleted Successfully",
      description,
      type: ListFormModalType.DELETE_LIST,
    });
  };

  const handleRegisterBatch = (registrants: string[]) => {
    listsContractClient
      .register_batch({
        list_id: parseInt(id as any) as any,
        registrations: registrants.map((data: string) => ({
          registrant_id: data,
          status: "Approved",
          submitted_ms: Date.now(),
          updated_ms: Date.now(),
          notes: "",
        })),
      })
      .then(() => {
        setFinishModal({ open: true, type: ListFormModalType.BATCH_REGISTER });
      })
      .catch((error) => console.error(error));

    dispatch.listEditor.updateListModalState({
      header: "Account(s) Registered Successfully",
      description,
      type: ListFormModalType.BATCH_REGISTER,
    });
  };

  const handleUnRegisterAccount = (registrants: AccountGroupItem[]) => {
    if (!id) return;
    const allTransactions: any = [];

    registrants.map((registrant: AccountGroupItem) => {
      allTransactions.push(
        buildTransaction("unregister", {
          receiverId: LISTS_CONTRACT_ACCOUNT_ID,
          args: {
            list_id: Number(id),
            registration_id: Number(registrant.registrationId),
          },
          deposit: floatToYoctoNear(0.015),
          gas: "300000000000000",
        }),
      );
    });

    naxiosInstance
      .contractApi({
        contractId: LISTS_CONTRACT_ACCOUNT_ID,
      })
      .callMultiple(allTransactions)
      .then((_res) => {
        dispatch.listEditor.updateListModalState({
          header: "Account(s) Deleted From List Successfully",
          description,
          type: ListFormModalType.UNREGISTER,
        });
      })
      .catch((err) => console.error(err));
  };

  const handleRemoveAdmin = (accounts: AccountGroupItem[]) => {
    const accountIds = accounts.map(prop("accountId"));

    listsContractClient
      .remove_admins_from_list({
        list_id: Number(id),
        admins: accountIds,
      })
      .then(() => {
        setFinishModal({ open: true, type: ListFormModalType.REMOVE_ADMINS });
      })
      .catch((error) => {
        console.error("Error adding admins to list", error);
      });

    dispatch.listEditor.updateListModalState({
      header: "Admin(s) Removed Successfully",
      description,
      type: ListFormModalType.REMOVE_ADMINS,
    });
  };

  const handleSaveAdminsSettings = (admins: AccountId[]) => {
    if (!id) return;

    listsContractClient
      .add_admins_to_list({
        list_id: Number(id),
        admins,
      })
      .then(() => {
        setFinishModal({ open: true, type: ListFormModalType.ADD_ADMINS });
      })
      .catch((error) => {
        console.error("Error adding admins to list", error);
      });

    dispatch.listEditor.updateListModalState({
      header: "Admin(s) Added Successfully",
      description,
      type: ListFormModalType.ADD_ADMINS,
    });
  };

  const handleChangeTransferOwnerField = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTransferAccountField(value);
    const data = await validateAccountId(value);
    setTransferAccountError(data);
  };

  const handleTransferOwner = () => {
    if (transferAccountError && !transferAccountField) return;
    if (!id) return; // Ensure id is available

    listsContractClient
      .transfer_list_ownership({
        list_id: parseInt(id as string),
        new_owner_id: transferAccountField,
      })
      .then((data) => {
        if (data) {
          setFinishModal({
            open: true,
            type: ListFormModalType.TRANSFER_OWNER,
          });
        }
      })
      .catch((error) => {
        console.error("Error Transferring Owner", error);
      });

    dispatch.listEditor.updateListModalState({
      header: "Transfer of Ownership Successfully",
      description,
      type: ListFormModalType.TRANSFER_OWNER,
    });
  };

  return {
    handleDeleteList,
    handleSaveAdminsSettings,
    handleChangeTransferOwnerField,
    handleTransferOwner,
    transferAccountField,
    transferAccountError,
    setTransferAccountField,
    handleRegisterBatch,
    finishModal,
    setFinishModal,
    handleRemoveAdmin,
    accounts,
    setAccounts,
    setTransferAccountError,
    handleUnRegisterAccount,
    admins,
    setAdmins,
  };
};
