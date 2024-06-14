import { useCallback } from "react";

import { create, useModal } from "@ebay/nice-modal-react";

import { dispatch, useTypedSelector } from "@/app/_store";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/common/ui/components";

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

  const state = useTypedSelector(({ donation }) => donation);

  return (
    <Dialog open={self.visible}>
      <DialogContent
        onBackClick={
          state.currentStep !== "allocation" && state.currentStep !== "done"
            ? dispatch.donation.handlePrevStep
            : undefined
        }
        onCloseClick={close}
      >
        {"accountId" in props && (
          <DonationToProject closeDialog={close} {...props} {...state} />
        )}

        {"potId" in props && (
          <DonationToPot closeDialog={close} {...props} {...state} />
        )}

        {!("accountId" in props) && !("potId" in props) && (
          <DialogHeader className="w-full rounded-lg">
            <Alert variant="destructive" className="bg-white">
              <AlertTitle>Runtime error!</AlertTitle>

              <AlertDescription>
                Please contact PotLock team for help.
              </AlertDescription>
            </Alert>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
});
