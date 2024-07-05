import { useEffect } from "react";

import { useModal } from "@ebay/nice-modal-react";
import { useSearchParams } from "next/navigation";

import { useRouteQuerySync } from "@/common/lib";

import { DonationModal } from "../components/DonationModal";

export const useDonationSuccessWalletRedirect = () => {
  const modal = useModal(DonationModal);
  const searchParams = useSearchParams();
  const { syncRouteQuery } = useRouteQuerySync();
  const transactionHash = searchParams.getAll("transactionHashes").at(-1);
  const accountIdRouteParam = searchParams.get("donateTo") ?? undefined;
  const potIdRouteParam = searchParams.get("donateToPot") ?? undefined;

  useEffect(() => {
    if (
      transactionHash &&
      Boolean(accountIdRouteParam ?? potIdRouteParam) &&
      !modal.visible
    ) {
      modal.show({
        accountId: accountIdRouteParam,
        potId: potIdRouteParam,
        transactionHash,
      });

      syncRouteQuery({
        donateTo: null,
        donateToPot: null,
        transactionHashes: null,
      });
    }
  }, [
    accountIdRouteParam,
    modal,
    potIdRouteParam,
    syncRouteQuery,
    transactionHash,
  ]);
};

// TODO: https://github.com/PotLock/potlock-nextjs-app/issues/86
// export const useDonationFailureWalletRedirect = () => {
//   ...
// }
