import { ChangeEvent, useState } from "react";

import { useRouter } from "next/router";

import {
  add_admins_to_list,
  delete_list,
  registerBatch,
  transfer_list_ownership,
} from "@/common/contracts/potlock/lists";
import { validateAccountId } from "@/modules/core";

export const useListForm = () => {
  const { push, query } = useRouter();
  const [transferAccountField, setTransferAccountField] = useState<string>("");
  const [transferAccountError, setTransferAccountError] = useState<
    string | undefined
  >("");
  const [admins, setAdmins] = useState<any[]>([]); // Adjust the type as needed
  const id = query.id; // Get the id from the route parameters

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
      .then((data) => data)
      .catch((error) => console.error(error));
  };

  const handleSaveAdminsSettings = () => {
    if (!id) return; // Ensure id is available
    add_admins_to_list({
      list_id: parseInt(id as string),
      admins,
    })
      .then((data) => {
        console.log("Added admins to list", data);
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
        console.log("Transferred list ownership", data);
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
    setTransferAccountError,
    admins,
    setAdmins,
  };
};
