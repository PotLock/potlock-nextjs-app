import { useEffect } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { useRouteQuery } from "@/common/lib";
import { useDispatch } from "@/store/hooks";

import { PotDeploymentModal } from "../components/success-modal";

export const usePotDeploymentSuccessMiddleware = () => {
  const dispatch = useDispatch();
  const resultModal = useModal(PotDeploymentModal);

  const {
    query: { transactionHashes },
    setSearchParams,
  } = useRouteQuery();

  const transactionHash =
    (Array.isArray(transactionHashes) ? transactionHashes.at(-1) : undefined) ??
    (typeof transactionHashes === "string" && transactionHashes.length > 0
      ? transactionHashes
      : undefined);

  const isTransactionOutcomeDetected = transactionHash !== undefined;

  useEffect(() => {
    if (isTransactionOutcomeDetected && !resultModal.visible) {
      dispatch.potConfiguration.reset();

      dispatch.potConfiguration.handleDeploymentOutcome(transactionHash).finally(() => {
        resultModal.show();
        setSearchParams({ transactionHashes: null });
      });
    }
  }, [
    dispatch.potConfiguration,
    isTransactionOutcomeDetected,
    resultModal,
    setSearchParams,
    transactionHash,
  ]);
};

// TODO: https://github.com/PotLock/potlock-nextjs-app/issues/86
// export const useDeploymentFailureMiddleware = () => {
//   ...
// }
