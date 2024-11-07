import { useEffect } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { useRouteQuery } from "@/common/lib";
import { dispatch } from "@/store";

import { DonationModal } from "../components/DonationModal";

export const useDonationSuccessWalletRedirect = () => {
  const donationModal = useModal(DonationModal);

  const {
    query: {
      donateTo,
      donateToPot,
      donateToList,
      donateToCampaign,
      transactionHashes,
    },
    setSearchParams,
  } = useRouteQuery();

  const recipientAccountId =
    typeof donateTo === "string" ? donateTo : undefined;

  const potAccountId =
    typeof donateToPot === "string" ? donateToPot : undefined;

  const listId =
    typeof donateToList === "string" ? parseInt(donateToList) : undefined;

  const campaignId =
    typeof donateToCampaign === "string"
      ? parseInt(donateToCampaign)
      : undefined;

  const transactionHash =
    (Array.isArray(transactionHashes) ? transactionHashes.at(-1) : undefined) ??
    (typeof transactionHashes === "string" ? transactionHashes : undefined);

  const isTransactionOutcomeDetected =
    transactionHash && Boolean(recipientAccountId ?? potAccountId);

  useEffect(() => {
    if (isTransactionOutcomeDetected && !donationModal.visible) {
      void dispatch.donation.handleOutcome(transactionHash).finally(() => {
        donationModal.show({
          accountId: recipientAccountId,
          potId: potAccountId,
          listId,
          campaignId,
          transactionHash,
        });

        setSearchParams({
          donateTo: null,
          donateToPot: null,
          donateToList: null,
          transactionHashes: null,
          donateToCampaign: null,
        });
      });
    }
  }, [
    isTransactionOutcomeDetected,
    donationModal,
    donationModal.visible,
    listId,
    campaignId,
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
