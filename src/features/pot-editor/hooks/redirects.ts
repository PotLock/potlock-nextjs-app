import { useEffect } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { useRouteQuery } from "@/common/lib";
import { dispatch } from "@/store";

import { PotEditorDeploymentModal } from "../components/PotEditorDeploymentModal";

export const useDeploymentSuccessWalletRedirect = () => {
  const resultModal = useModal(PotEditorDeploymentModal);

  const {
    query: { transactionHashes },
    setSearchParams,
  } = useRouteQuery();

  const transactionHash =
    (Array.isArray(transactionHashes) ? transactionHashes.at(-1) : undefined) ??
    (typeof transactionHashes === "string" ? transactionHashes : undefined);

  const isTransactionOutcomeDetected = transactionHash !== undefined;

  useEffect(() => {
    if (isTransactionOutcomeDetected && !resultModal.visible) {
      dispatch.potEditor.reset();

      dispatch.potEditor.handleDeploymentOutcome(transactionHash).finally(() => {
        resultModal.show();
        setSearchParams({ transactionHashes: null });
      });
    }
  }, [isTransactionOutcomeDetected, resultModal, setSearchParams, transactionHash]);
};

// TODO: https://github.com/PotLock/potlock-nextjs-app/issues/86
// export const useDeploymentFailureWalletRedirect = () => {
//   ...
// }
