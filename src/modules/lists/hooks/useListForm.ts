import { ChangeEvent, useEffect, useState } from "react";

import { useRouter } from "next/router";

import {
  add_admins_to_list,
  delete_list,
  registerBatch,
  remove_admins_from_list,
  transfer_list_ownership,
  unregister_from_list,
} from "@/common/contracts/potlock/lists";
import { AccountId } from "@/common/types";
import { validateAccountId } from "@/modules/core";

// Step 1: Define the enum
export enum ListFormModalType {
  NONE = "NONE",
  BATCH_REGISTER = "BATCH_REGISTER",
  UNREGISTER = "UNREGISTER",
  ADD_ADMINS = "ADD_ADMINS",
  REMOVE_ADMINS = "REMOVE_ADMINS",
  TRANSFER_OWNER = "TRANSFER_OWNER",
}

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
  const [finishText, setFinishText] = useState<{
    header: string;
    body: string;
  }>({ header: "", body: "" });
  const [admins, setAdmins] = useState<any[]>([]);
  const id = query.id;

  useEffect(() => {
    if (finishModal.type === ListFormModalType.TRANSFER_OWNER) {
      setFinishText({
        header: "Transfer of Ownership was Successful",
        body: "You may now close this window",
      });
    } else if (finishModal.type === ListFormModalType.ADD_ADMINS) {
      setFinishText({
        header: "Admin(s) added Successfully",
        body: "You may now close this window",
      });
    } else if (finishModal.type === ListFormModalType.REMOVE_ADMINS) {
      setFinishText({
        header: "Admin removed Successfully",
        body: "You may now close this window",
      });
    } else if (finishModal.type === ListFormModalType.UNREGISTER) {
      setFinishText({
        header: "Account Unregistered Successfully",
        body: "You may now close this window",
      });
    } else if (finishModal.type === ListFormModalType.BATCH_REGISTER) {
      setFinishText({
        header: "Batch Registration was Successful",
        body: "You may now close this window",
      });
    } else if (finishModal.type === ListFormModalType.NONE) {
      setFinishText({ header: "", body: "" });
    }
  }, [finishModal.type]);

  const handleDeleteList = () => {
    if (!id) return; // Ensure id is available
    delete_list({ list_id: parseInt(id as string) })
      .then(() => {
        push("/list");
      })
      .catch((error) => {
        console.error("Error deleting list", error);
      });
  };

  const handleRegisterBatch = (list_id: string, registrants: string[]) => {
    registerBatch({
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
  };

  const handleSaveAdminsSettings = (admins: AccountId[]) => {
    if (!id) return; // Ensure id is available
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
    finishText,
    handleRemoveAdmin,
    setTransferAccountError,
    handleUnRegisterAccount,
    admins,
    setAdmins,
  };
};
