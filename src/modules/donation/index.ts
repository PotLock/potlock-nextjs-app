import { useCallback } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { useTypedSelector } from "@/app/_store";

import { DonationModal } from "./components/DonationModal";
import { DonationInputs } from "./models";

export const useDonation = (props: DonationInputs) => {
  const modal = useModal(DonationModal);
  const state = useTypedSelector(({ donation }) => donation);

  return {
    openDonationModal: useCallback(
      (event: React.MouseEvent) => {
        event.preventDefault();
        modal.show({ ...props, ...state });
      },

      [modal, props, state],
    ),
  };
};
