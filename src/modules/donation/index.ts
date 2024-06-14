import { useCallback } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { DonationModal } from "./components/DonationModal";
import { DonationInputs } from "./models";

export const useDonation = (props: DonationInputs) => {
  const modal = useModal(DonationModal);

  return {
    openDonationModal: useCallback(
      (event: React.MouseEvent) => {
        event.preventDefault();
        modal.show(props);
      },

      [modal, props],
    ),
  };
};
