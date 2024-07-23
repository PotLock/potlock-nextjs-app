import { useEffect } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { useSearchParams } from "@/common/lib";
import { dispatch } from "@/store";

import { DonationModal } from "../components/DonationModal";

export const useDonationSuccessWalletRedirect = () => {
  const modal = useModal(DonationModal);

  const {
    searchParams: { donateTo, donateToPot, transactionHashes },
    setSearchParams,
  } = useSearchParams();

  const recipientAccountId =
    typeof donateTo === "string" ? donateTo : undefined;

  const potAccountId =
    typeof donateToPot === "string" ? donateToPot : undefined;

  const transactionHash =
    (Array.isArray(transactionHashes) ? transactionHashes.at(-1) : undefined) ??
    (typeof transactionHashes === "string" ? transactionHashes : undefined);

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

        setSearchParams({
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
    setSearchParams,
    transactionHash,
  ]);
};

// TODO: https://github.com/PotLock/potlock-nextjs-app/issues/86
// export const useDonationFailureWalletRedirect = () => {
//   ...
// }
