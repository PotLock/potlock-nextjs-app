import { useEffect } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { useRouteQuery } from "@/common/lib";
import { dispatch } from "@/store";

import { PotDeploymentResultModal } from "../components/deployment";

export const useDeploymentSuccessWalletRedirect = () => {
  const resultModal = useModal(PotDeploymentResultModal);

  const {
    query: { transactionHashes },
    setSearchParams,
  } = useRouteQuery();

  const transactionHash =
    (Array.isArray(transactionHashes) ? transactionHashes.at(-1) : undefined) ??
    (typeof transactionHashes === "string" ? transactionHashes : undefined);

  useEffect(() => {
    if (transactionHash && !resultModal.visible) {
      void dispatch.pot
        .handleDeploymentOutcome(transactionHash)
        .finally(() =>
          resultModal
            .show()
            .finally(() => setSearchParams({ transactionHashes: null })),
        );
    }
  }, [setSearchParams, resultModal, transactionHash]);
};

// TODO: https://github.com/PotLock/potlock-nextjs-app/issues/86
// export const useDeploymentFailureWalletRedirect = () => {
//   ...
// }
