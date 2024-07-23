import { useEffect } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { useParsedRouteQuery, useRouteQuerySync } from "@/common/lib";
import { dispatch } from "@/store";

import { DonationModal } from "../components/DonationModal";

export const useDonationSuccessWalletRedirect = () => {
  const modal = useModal(DonationModal);
  const { syncRouteQuery } = useRouteQuerySync();
  const searchParams = useParsedRouteQuery();
  const accountIdQueryParam = searchParams.get("donateTo");
  const potIdQueryParam = searchParams.get("donateToPot");
  const transactionHashesQueryParam = searchParams.get("transactionHashes");

  const recipientAccountId =
    typeof accountIdQueryParam === "string" ? accountIdQueryParam : undefined;

  const potAccountId =
    typeof potIdQueryParam === "string" ? potIdQueryParam : undefined;

  const transactionHash = Array.isArray(transactionHashesQueryParam)
    ? transactionHashesQueryParam.at(-1)
    : undefined;

  useEffect(() => {
    if (
      transactionHash &&
      Boolean(recipientAccountId ?? potAccountId) &&
      !modal.visible
    ) {
      dispatch.donation.handleSuccessByTxHash(transactionHash).then(() => {
        modal.show({
          accountId: recipientAccountId,
          potId: potAccountId,
          transactionHash,
        });

        syncRouteQuery({
          donateTo: null,
          donateToPot: null,
          transactionHashes: null,
        });
      });
    }
  }, [
    modal,
    potAccountId,
    recipientAccountId,
    syncRouteQuery,
    transactionHash,
  ]);
};

// TODO: https://github.com/PotLock/potlock-nextjs-app/issues/86
// export const useDonationFailureWalletRedirect = () => {
//   ...
// }
