import { useCallback } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { dispatch } from "@/app/_store";

import { DonationModal } from "../components/DonationModal";
import { DonationParameters } from "../models";

export const useDonation = (props: DonationParameters) => {
  const modal = useModal(DonationModal);

  return {
    openDonationModal: useCallback(
      (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        dispatch.donation.reset();
        modal.show(props);
      },

      [modal, props],
    ),
  };
};
