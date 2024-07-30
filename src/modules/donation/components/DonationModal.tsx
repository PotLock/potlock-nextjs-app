import { useCallback } from "react";

import { create, useModal } from "@ebay/nice-modal-react";

import { walletApi } from "@/common/contracts";
import { useRouteQuery } from "@/common/lib";
import { Button, Dialog, DialogContent } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { ModalErrorBody } from "@/modules/core";
import { dispatch, useTypedSelector } from "@/store";

import { DonationFlow, DonationFlowProps } from "./DonationFlow";
import { DonationParameters } from "../models";

export type DonationModalProps = DonationParameters &
  Pick<DonationFlowProps, "transactionHash"> & {};

export const DonationModal = create((props: DonationModalProps) => {
  const self = useModal();
  const donationState = useTypedSelector(({ donation }) => donation);
  const { isAuthenticated } = useAuth();
  const { setSearchParams } = useRouteQuery();

  const close = useCallback(() => {
    self.hide();
    dispatch.donation.reset();
    self.remove();

    setSearchParams({
      donateTo: null,
      donateToPot: null,
      transactionHashes: null,
    });
  }, [self, setSearchParams]);

  const onSignInClick = useCallback(() => {
    walletApi.signInModal();
    close();
  }, [close]);

  return (
    <Dialog open={self.visible}>
      <DialogContent
        className={cn({
          "max-w-130": donationState.currentStep !== "success",
          "max-w-120": donationState.currentStep === "success",
        })}
        contrastActions={donationState.currentStep === "success"}
        onBackClick={
          donationState.currentStep !== "allocation" &&
          donationState.currentStep !== "success"
            ? dispatch.donation.previousStep
            : undefined
        }
        onCloseClick={close}
      >
        {!isAuthenticated ? (
          <ModalErrorBody
            heading="Donation"
            title="Authentication required"
            callToAction={
              <div
                un-flex="~"
                un-items="center"
                un-justify="center"
                un-gap="2"
                un-text="primary"
              >
                <span className="prose" un-text="lg">
                  Please
                </span>

                <Button
                  font="semibold"
                  variant="standard-filled"
                  onClick={onSignInClick}
                  className="border-none bg-[#342823] shadow-none"
                >
                  Sign In
                </Button>

                <span className="prose" un-text="lg">
                  to continue.
                </span>
              </div>
            }
          />
        ) : (
          <>
            {!("accountId" in props) && !("potId" in props) ? (
              <ModalErrorBody
                heading="Donation"
                title="Unable to detect donation recipient."
              />
            ) : (
              <DonationFlow closeModal={close} {...props} {...donationState} />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
});
