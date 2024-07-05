import { useCallback } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { dispatch } from "@/app/_store";
import { useRouteQuerySync } from "@/common/lib";

import { useDonationSuccessWalletRedirect } from "./redirects";
import { DonationModal } from "../components/DonationModal";
import { DonationParameters } from "../models";

export * from "./fees";
export * from "./forms";

export const useDonation = (props: DonationParameters) => {
  const modal = useModal(DonationModal);
  const { syncRouteQuery } = useRouteQuerySync();

  const openDonationModal = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      dispatch.donation.reset();

      if ("accountId" in props) {
        syncRouteQuery({ donateTo: props.accountId });
      } else if ("potId" in props) {
        syncRouteQuery({ donateToPot: props.potId });
      }

      modal.show(props);
    },

    [modal, props, syncRouteQuery],
  );

  useDonationSuccessWalletRedirect();

  return { openDonationModal };
};
