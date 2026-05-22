import { useCallback } from "react";

import { useModal } from "@ebay/nice-modal-react";

import { useRouteQuery } from "@/common/lib";
import { useDispatch } from "@/store/hooks";

import { useDonationSuccessWalletRedirect } from "./redirects";
import { DonationModal, type DonationModalProps } from "../components/modal";
import { DonationAllocationKey } from "../types";

export type DonationUserFlowProps = DonationAllocationKey &
  Pick<DonationModalProps, "cachedTokenId"> & {};

export const useDonationUserFlow = (props: DonationUserFlowProps) => {
  const dispatch = useDispatch();
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

    [dispatch.donation, modal, props, setSearchParams],
  );

  useDonationSuccessWalletRedirect();

  return { openDonationModal };
};
