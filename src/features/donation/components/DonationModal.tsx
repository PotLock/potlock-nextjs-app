import { useCallback } from "react";

import { create, useModal } from "@ebay/nice-modal-react";

import { nearProtocolClient } from "@/common/api/near-protocol";
import { useRouteQuery } from "@/common/lib";
import { Button, Dialog, DialogContent, ModalErrorBody } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { useWalletUserSession } from "@/common/wallet";
import { dispatch } from "@/store";

import { DonationFlow, DonationFlowProps } from "./DonationFlow";
import { useDonationState } from "../models";
import { DonationAllocationKey } from "../types";

export type DonationModalProps = DonationAllocationKey &
  Pick<DonationFlowProps, "transactionHash"> & {};

export const DonationModal = create((props: DonationModalProps) => {
  const viewer = useWalletUserSession();
  const self = useModal();
  const isSingleProjectDonation = "accountId" in props;
  const isPotDonation = "potId" in props;
  const isListDonation = "listId" in props;
  const isCampaignDonation = "campaignId" in props;
  const { currentStep } = useDonationState();
  const { setSearchParams } = useRouteQuery();

  const close = useCallback(() => {
    self.hide();
    dispatch.donation.reset();
    self.remove();

    setSearchParams({
      donateTo: null,
      donateToPot: null,
      donateToList: null,
      donateToCampaign: null,
      transactionHashes: null,
    });
  }, [self, setSearchParams]);

  const onSignInClick = useCallback(() => {
    nearProtocolClient.walletApi.signInModal();
    close();
  }, [close]);

  const isKnownDonationType =
    !isSingleProjectDonation && !isPotDonation && !isListDonation && !isCampaignDonation;

  return (
    <Dialog open={self.visible}>
      <DialogContent
        className={cn({
          "max-w-130": currentStep !== "success",
          "max-w-120": currentStep === "success",
        })}
        contrastActions={currentStep === "success"}
        onBackClick={
          currentStep !== "allocation" && currentStep !== "success"
            ? dispatch.donation.previousStep
            : undefined
        }
        onCloseClick={close}
      >
        {!viewer.isSignedIn ? (
          <ModalErrorBody
            heading="Donation"
            title="Authentication required"
            callToAction={
              <div un-flex="~" un-items="center" un-justify="center" un-gap="2" un-text="primary">
                <span className="prose" un-text="lg">
                  {"Please"}
                </span>

                <Button
                  font="semibold"
                  variant="standard-filled"
                  onClick={onSignInClick}
                  className="border-none bg-[#342823] shadow-none"
                >
                  {"Sign In"}
                </Button>

                <span className="prose" un-text="lg">
                  {"to continue."}
                </span>
              </div>
            }
          />
        ) : (
          <>
            {isKnownDonationType ? (
              <ModalErrorBody heading="Donation" title="Unable to determine donation type." />
            ) : (
              <DonationFlow closeModal={close} {...props} />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
});
