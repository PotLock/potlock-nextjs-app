import { useCallback } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { useSearchParams } from "@/common/lib";
import { dispatch } from "@/store";

import { useDonationSuccessWalletRedirect } from "./redirects";
import { DonationModal } from "../components/DonationModal";
import { DonationParameters } from "../models";

export * from "./fees";
export * from "./forms";

export const useDonation = (props: DonationParameters) => {
  const modal = useModal(DonationModal);
  const { setSearchParams } = useSearchParams();

  const openDonationModal = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      dispatch.donation.reset();

      if ("accountId" in props) {
        setSearchParams({ donateTo: props.accountId });
      } else if ("potId" in props) {
        setSearchParams({ donateToPot: props.potId });
      }

      modal.show(props);
    },

    [modal, props, setSearchParams],
  );

  useDonationSuccessWalletRedirect();

  return { openDonationModal };
};
