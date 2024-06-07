import { useCallback } from "react";

import { create, useModal } from "@ebay/nice-modal-react";

import { AccountId, PotId } from "@/common/api/potlock";
import { Dialog, DialogContent } from "@/common/ui/components/dialog";

import { DonationToAccount } from "./DonationToAccount";
import { DonationToPot } from "./DonationToPot";

export type DonationModalProps = { accountId: AccountId } | { potId: PotId };

export const DonationModal = create((props: DonationModalProps) => {
  const self = useModal();

  const close = useCallback(() => {
    self.hide();
    self.remove();
  }, [self]);

  return (
    <Dialog open={self.visible}>
      <DialogContent onCloseClick={close}>
        {"accountId" in props && (
          <DonationToAccount accountId={props.accountId} />
        )}

        {"potId" in props && <DonationToPot potId={props.potId} />}
      </DialogContent>
    </Dialog>
  );
});

export const useDonationModal = (props: DonationModalProps) => {
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
