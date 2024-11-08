import { useEffect } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { useRouteQuery } from "@/common/lib";
import { useToast } from "@/common/ui/hooks/toasts";
import { dispatch, useTypedSelector } from "@/store";

import { ListActionsModal } from "../components/listActionsModal";
import { ListFormModalType } from "../types";

export const useListDeploymentSuccessRedirect = () => {
  const { toast } = useToast();

  const resultModal = useModal(ListActionsModal);

  const listValues = useTypedSelector((state) => state.listEditor);

  const {
    query: { transactionHashes, type },
    setSearchParams,
  } = useRouteQuery();

  const voteType =
    listValues.type === ListFormModalType.UPVOTE ||
    listValues.type === ListFormModalType.DOWNVOTE;
  const transactionHash =
    (Array.isArray(transactionHashes) ? transactionHashes.at(-1) : undefined) ??
    (typeof transactionHashes === "string" ? transactionHashes : undefined);

  const isTransactionOutcomeDetected = transactionHash !== undefined;

  useEffect(() => {
    if (
      listValues.type === ListFormModalType.UPDATE_ACCOUNT &&
      isTransactionOutcomeDetected
    ) {
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        title: `Account Status Updated to ${listValues.name} Successfully`,
      });
      setSearchParams({ transactionHashes: null });
    } else if (voteType && isTransactionOutcomeDetected && listValues.name) {
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        title: `${listValues.name} has been ${listValues.type === ListFormModalType.UPVOTE ? "added" : "removed"} to your favorites`,
      });
      setSearchParams({ transactionHashes: null });
    } else if (isTransactionOutcomeDetected && !voteType) {
      dispatch.listEditor
        .handleListContractActions(transactionHash)
        .finally(() => {
          resultModal.show();
          setSearchParams({ transactionHashes: null });
        });
    }
  }, [
    isTransactionOutcomeDetected,
    listValues.name,
    listValues.type,
    resultModal,
    setSearchParams,
    toast,
    transactionHash,
    type,
    voteType,
  ]);
};
