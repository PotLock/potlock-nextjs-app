import { ChangeEvent, useEffect, useState } from "react";

import { useRouter } from "next/router";

import {
  add_admins_to_list,
  delete_list,
  register_batch,
  remove_admins_from_list,
  transfer_list_ownership,
  unregister_from_list,
} from "@/common/contracts/potlock/lists";
import { AccountId } from "@/common/types";
import { validateAccountId } from "@/modules/core";
import { dispatch } from "@/store";

import { ListFormModalType } from "../types";

export const useListForm = () => {
  const { push, query } = useRouter();
  const [transferAccountField, setTransferAccountField] = useState<string>("");
  const [transferAccountError, setTransferAccountError] = useState<
    string | undefined
  >("");
  const [finishModal, setFinishModal] = useState<{
    open: boolean;
    type: ListFormModalType;
  }>({ open: false, type: ListFormModalType.NONE });
  const [admins, setAdmins] = useState<AccountId[]>([]);
  const [accounts, setAccounts] = useState<AccountId[]>([]);
  const id = query.id;

  const description = "You may now close this window";

  const handleDeleteList = () => {
    if (!id) return; // Ensure id is available
    delete_list({ list_id: parseInt(id as string) })
      .then(() => {
        push("/list");
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

  const handleRegisterBatch = (list_id: string, registrants: string[]) => {
    register_batch({
      list_id: parseInt(list_id as any) as any,
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

  const handleUnRegisterAccount = (registrant_id: number) => {
    if (!id) return;

    unregister_from_list({
      list_id: Number(id),
      registration_id: registrant_id,
    })
      .then(() => {
        setFinishModal({ open: true, type: ListFormModalType.UNREGISTER });
      })
      .catch((error) => console.error(error));
    dispatch.listEditor.updateListModalState({
      header: "Account Deleted From List Successfully",
      description,
      type: ListFormModalType.UNREGISTER,
    });
  };

  const handleRemoveAdmin = (admins: Array<string>) => {
    remove_admins_from_list({
      list_id: parseInt(id as string),
      admins,
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
    add_admins_to_list({
      list_id: parseInt(id as string),
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

  const handleChangeTransferOwnerField = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;
    setTransferAccountField(value);
    const data = await validateAccountId(value);
    setTransferAccountError(data);
  };

  const handleTransferOwner = () => {
    if (transferAccountError && !transferAccountField) return;
    if (!id) return; // Ensure id is available
    transfer_list_ownership({
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
