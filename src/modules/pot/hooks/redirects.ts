import { useEffect } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { useRouteQuery } from "@/common/lib";
import { dispatch } from "@/store";

import { PotDeploymentSuccessModal } from "../components/deployment";

export const useDeploymentSuccessWalletRedirect = () => {
  const successModal = useModal(PotDeploymentSuccessModal);

  const {
    query: { transactionHashes },
    setSearchParams,
  } = useRouteQuery();

  const transactionHash =
    (Array.isArray(transactionHashes) ? transactionHashes.at(-1) : undefined) ??
    (typeof transactionHashes === "string" ? transactionHashes : undefined);

  useEffect(() => {
    if (transactionHash && !successModal.visible) {
      console.log("test");

      void dispatch.pot
        .handleDeploymentOutcome(transactionHash)
        .finally(() =>
          successModal
            .show()
            .finally(() => setSearchParams({ transactionHashes: null })),
        );
    }
  }, [setSearchParams, successModal, transactionHash]);
};

// TODO: https://github.com/PotLock/potlock-nextjs-app/issues/86
// export const useDeploymentFailureWalletRedirect = () => {
//   ...
// }
