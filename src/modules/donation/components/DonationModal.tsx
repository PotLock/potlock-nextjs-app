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

import { DonationFlow } from "./DonationFlow";
import { DonationParameters } from "../models";

export type DonationModalProps = DonationParameters & {};

export const DonationModal = create((props: DonationModalProps) => {
  const self = useModal();

  const close = useCallback(() => {
    self.hide();
    dispatch.donation.reset();
    self.remove();
  }, [self]);

  const state = useTypedSelector(({ donation }) => donation);

  return (
    <Dialog open={self.visible} onOpenChange={dispatch.donation.reset}>
      <DialogContent
        onBackClick={
          state.currentStep !== "allocation" && state.currentStep !== "success"
            ? dispatch.donation.previousStep
            : undefined
        }
        onCloseClick={close}
      >
        {!("accountId" in props) && !("potId" in props) ? (
          <DialogHeader className="w-full rounded-lg">
            <Alert variant="destructive" className="bg-white">
              <AlertTitle>Runtime error!</AlertTitle>

              <AlertDescription>
                Please contact PotLock team for help.
              </AlertDescription>
            </Alert>
          </DialogHeader>
        ) : (
          <DonationFlow closeDialog={close} {...props} {...state} />
        )}
      </DialogContent>
    </Dialog>
  );
});