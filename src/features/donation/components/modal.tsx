import { useCallback, useMemo } from "react";

import { create, useModal } from "@ebay/nice-modal-react";

import { nearProtocolClient } from "@/common/blockchains/near-protocol";
import { isBigSource, useRouteQuery } from "@/common/lib";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  Form,
  ModalErrorBody,
} from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import { useToken } from "@/entities/_shared/token";
import { dispatch } from "@/store";

import { DonationGroupAllocation } from "./group-allocation";
import { DonationModalConfirmationScreen } from "./modal-confirmation-screen";
import { DonationSingleRecipientAllocation } from "./single-recipient-allocation";
import { DonationSuccess, DonationSuccessProps } from "./single-recipient-success";
import { useDonationForm } from "../hooks";
import { useDonationState } from "../models/store";
import { DonationAllocationKey } from "../types";

type DonationModalContentProps = DonationAllocationKey &
  Pick<DonationSuccessProps, "transactionHash"> & {
    closeModal: VoidFunction;
  };

const DonationModalContent: React.FC<DonationModalContentProps> = ({
  transactionHash,
  closeModal,
  ...props
}) => {
  const viewer = useWalletUserSession();
  const { currentStep } = useDonationState();

  const { form, matchingPots, minAmountError, isDisabled, onSubmit, totalAmountFloat } =
    useDonationForm(props);

  const [tokenId] = form.watch(["tokenId"]);

  const { data: token } = useToken({
    tokenId,
    balanceCheckAccountId: viewer?.accountId,
  });

  const isBalanceSufficient = isBigSource(totalAmountFloat)
    ? (token?.balance?.gt(totalAmountFloat) ?? false)
    : false;

  const allocationScreenProps = useMemo(
    () => ({
      form,
      isBalanceSufficient,
      minAmountError,
      balanceFloat: token?.balanceFloat ?? 0.0,
      totalAmountFloat,
      matchingPots,
      ...props,
    }),

    [
      token?.balanceFloat,
      form,
      isBalanceSufficient,
      matchingPots,
      minAmountError,
      props,
      totalAmountFloat,
    ],
  );

  const confirmationScreenProps = useMemo(
    () => ({ form, totalAmountFloat }),
    [form, totalAmountFloat],
  );

  const successScreenProps = useMemo(
    () => ({ form, transactionHash, closeModal }),
    [closeModal, form, transactionHash],
  );

  const currentScreen = useMemo(() => {
    const defaultErrorScreen = (
      <ModalErrorBody heading="Donation" title="Unable to proceed with the next step." />
    );

    switch (currentStep) {
      case "allocation": {
        if ("accountId" in allocationScreenProps || "campaignId" in allocationScreenProps) {
          return <DonationSingleRecipientAllocation {...allocationScreenProps} />;
        } else if ("potId" in allocationScreenProps || "listId" in allocationScreenProps) {
          return <DonationGroupAllocation {...allocationScreenProps} />;
        } else return defaultErrorScreen;
      }

      case "confirmation":
        return <DonationModalConfirmationScreen {...confirmationScreenProps} />;

      case "success":
        return <DonationSuccess {...successScreenProps} />;

      default:
        return defaultErrorScreen;
    }
  }, [allocationScreenProps, confirmationScreenProps, currentStep, successScreenProps]);

  return (
    <Form {...form}>
      <form un-flex="~ col" un-h="full" {...{ onSubmit }}>
        {currentScreen}

        {currentStep !== "success" && (
          <DialogFooter>
            {currentStep === "allocation" && (
              <Button type="button" variant="brand-outline" color="black" disabled>
                {"Add to cart"}
              </Button>
            )}

            <Button
              type="button"
              variant="brand-filled"
              onClick={currentStep === "confirmation" ? onSubmit : dispatch.donation.nextStep}
              disabled={isDisabled || !isBalanceSufficient}
              className={cn({ "w-full": currentStep === "confirmation" })}
            >
              {currentStep === "confirmation" ? "Confirm donation" : "Proceed to donate"}
            </Button>
          </DialogFooter>
        )}
      </form>
    </Form>
  );
};

export type DonationModalProps = DonationAllocationKey &
  Pick<DonationModalContentProps, "transactionHash"> & {};

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
              <DonationModalContent closeModal={close} {...props} />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
});
