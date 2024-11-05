import { useEffect } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { useRouteQuery } from "@/common/lib";
import { dispatch } from "@/store";

import { CampaignFinishModal } from "../components/CampaignFinishModal";

export const useCampaignDeploymentRedirect = () => {
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
      dispatch.campaignEditor
        .handleCampaignContractActions(transactionHash)
        .finally(() => {
          resultModal.show();
          setSearchParams({ transactionHashes: null });
        });
    }
  }, [
    isTransactionOutcomeDetected,
    transactionHash,
    setSearchParams,
    resultModal,
  ]);
};
