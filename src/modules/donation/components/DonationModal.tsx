import { useCallback } from "react";

import { create, useModal } from "@ebay/nice-modal-react";

import { Dialog, DialogContent } from "@/common/ui/components";

import { DonationToPot } from "./DonationToPot";
import { DonationToProject } from "./DonationToProject";
import { DonationInputs, DonationState } from "../models";

export type DonationModalProps = DonationInputs & DonationState;

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
          <DonationToProject closeDialog={close} {...props} />
        )}

        {"potId" in props && <DonationToPot closeDialog={close} {...props} />}
      </DialogContent>
    </Dialog>
  );
});
