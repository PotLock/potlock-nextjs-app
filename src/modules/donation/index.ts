import { useCallback } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { DonationModal } from "./components/DonationModal";
import { DonationParameters } from "./models";

export { donationModel } from "./models";

export const useDonation = (props: DonationParameters) => {
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
