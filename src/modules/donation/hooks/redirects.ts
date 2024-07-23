import { useEffect } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { useSearchParams } from "@/common/lib";
import { dispatch } from "@/store";

import { DonationModal } from "../components/DonationModal";

export const useDonationSuccessWalletRedirect = () => {
  const modal = useModal(DonationModal);
  const { searchParams, setSearchParams } = useSearchParams();
  const accountIdQueryParam = searchParams.donateTo;
  const potIdQueryParam = searchParams.donateToPot;
  const transactionHashesQueryParam = searchParams.transactionHashes;

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
