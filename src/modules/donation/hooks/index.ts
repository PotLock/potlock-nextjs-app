import { useCallback } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { useRouteQuery } from "@/common/lib";
import { dispatch } from "@/store";

import { useDonationSuccessWalletRedirect } from "./redirects";
import { DonationModal } from "../components/DonationModal";
import { DonationAllocationKey } from "../types";

export * from "./allocation";
export * from "./forms";

export const useDonation = (props: DonationAllocationKey) => {
  const modal = useModal(DonationModal);
  const { setSearchParams } = useRouteQuery();

  const openDonationModal = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      dispatch.donation.reset();

      if ("accountId" in props) {
        setSearchParams({ donateTo: props.accountId });
      } else if ("potId" in props) {
        setSearchParams({ donateToPot: props.potId });
      } else if ("listId" in props) {
        setSearchParams({ donateToList: props.listId.toString() });
      } else if ("campaignId" in props) {
        setSearchParams({ donateToCampaign: props.campaignId.toString() });
      }

      modal.show(props);
    },

    [modal, props, setSearchParams],
  );

  useDonationSuccessWalletRedirect();

  return { openDonationModal };
};
