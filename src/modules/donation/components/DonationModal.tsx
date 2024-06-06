import { useCallback } from "react";

import { create, show, useModal } from "@ebay/nice-modal-react";

import { AccountId } from "@/common/api/potlock";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/common/ui/components/dialog";

export type DonationModalProps = {
  projectId: AccountId;
};

export const DonationModal = create(({ projectId }: DonationModalProps) => {
  const { hide, remove, visible } = useModal();

  const onCloseClick = useCallback(() => {
    hide();
    remove();
  }, [hide, remove]);

  return (
    <Dialog open={visible}>
      <DialogContent>
        <DialogClose aria-label="Close" onClick={onCloseClick}></DialogClose>

        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>

          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
});

export const useDonationModal = () => useModal(DonationModal);

export const openDonationModal = (props: DonationModalProps) =>
  show(DonationModal, props);
