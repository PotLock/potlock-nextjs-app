import { useEffect } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { StatusF24Enum } from "@/common/api/potlock";
import { useRouteQuery } from "@/common/lib";
import { dispatch, useTypedSelector } from "@/store";

import { ListActionsModal } from "../components/listActionsModal";
import { ListFormModalType } from "../types";

export const useListDeploymentSuccessRedirect = () => {
  const resultModal = useModal(ListActionsModal);
  const toast = useTypedSelector((state) => state.toast);

  const {
    query: { transactionHashes, type },
    setSearchParams,
  } = useRouteQuery();

  const voteType =
    toast.listType === ListFormModalType.UPVOTE ||
    toast.listType === ListFormModalType.DOWNVOTE;
  const transactionHash =
    (Array.isArray(transactionHashes) ? transactionHashes.at(-1) : undefined) ??
    (typeof transactionHashes === "string" ? transactionHashes : undefined);

  const isTransactionOutcomeDetected = transactionHash !== undefined;

  useEffect(() => {
    if (
      type === ListFormModalType.UPDATE_ACCOUNT &&
      toast.listType !== "NONE" &&
      isTransactionOutcomeDetected
    ) {
      dispatch.toast.showToast({
        message: `${toast.account} has been ${toast.listType?.toLowerCase()}`,
        listType: toast.listType as StatusF24Enum,
      });
      setSearchParams({ transactionHashes: null, type: null });
    } else if (voteType && isTransactionOutcomeDetected) {
      dispatch.toast.showToast({
        message: `${toast.name} has been added to your favorites`,
      });
    } else if (isTransactionOutcomeDetected && !voteType) {
      dispatch.listEditor
        .handleListContractActions(transactionHash)
        .finally(() => {
          resultModal.show();
          setSearchParams({ transactionHashes: null, type: null });
        });
    }
  }, [
    isTransactionOutcomeDetected,
    resultModal,
    setSearchParams,
    transactionHash,
    type,
  ]);
};
