import { useEffect } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { useRouteQuery } from "@/common/lib";
import { useDispatch } from "@/store/hooks";

import { CampaignFinishModal } from "../components/CampaignFinishModal";

export const useCampaignCreateOrUpdateRedirect = () => {
  const dispatch = useDispatch();
  const resultModal = useModal(CampaignFinishModal);

  const {
    query: { transactionHashes },
    setSearchParams,
  } = useRouteQuery();

  const transactionHash =
    (Array.isArray(transactionHashes) ? transactionHashes.at(-1) : undefined) ??
    (typeof transactionHashes === "string" ? transactionHashes : undefined);

  const isTransactionOutcomeDetected = transactionHash !== undefined;

  useEffect(() => {
    if (isTransactionOutcomeDetected) {
      dispatch.campaignEditor.handleCampaignContractActions(transactionHash).finally(() => {
        resultModal.show();
        setSearchParams({ transactionHashes: null });
      });
    }
  }, [
    isTransactionOutcomeDetected,
    transactionHash,
    setSearchParams,
    resultModal,
    dispatch.campaignEditor,
  ]);
};
