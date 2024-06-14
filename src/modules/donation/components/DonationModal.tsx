import { useCallback } from "react";

import { create, useModal } from "@ebay/nice-modal-react";

import { dispatch } from "@/app/_store";
import { Dialog, DialogContent } from "@/common/ui/components";

import { DonationToPot } from "./DonationToPot";
import { DonationToProject } from "./DonationToProject";
import { DonationInputs } from "../models";

export type DonationModalProps = DonationInputs & {};

export const DonationModal = create((props: DonationModalProps) => {
  const self = useModal();

  const close = useCallback(() => {
    self.hide();
    dispatch.donation.reset();
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
