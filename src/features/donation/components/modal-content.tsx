import { useMemo } from "react";

import { Button, DialogFooter, Form, ModalErrorBody } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import { useToken } from "@/entities/_shared/token";
import { dispatch } from "@/store";

import { DonationGroupAllocation } from "./group-allocation";
import { DonationModalConfirmationScreen } from "./modal-confirmation-screen";
import { DonationSingleRecipientAllocation } from "./single-recipient-allocation";
import { DonationSuccess, DonationSuccessProps } from "./single-recipient-success";
import { useDonationForm } from "../hooks/form";
import { useDonationState } from "../models/store";
import { DonationAllocationKey } from "../types";

export type DonationModalContentProps = DonationAllocationKey &
  Pick<DonationSuccessProps, "transactionHash"> & {
    closeModal: VoidFunction;
  };

export const DonationModalContent: React.FC<DonationModalContentProps> = ({
  transactionHash,
  closeModal,
  ...props
}) => {
  const viewer = useWalletUserSession();
  const { currentStep } = useDonationState();
  const { form, matchingPots, isDisabled, onSubmit, totalAmountFloat } = useDonationForm(props);
  const [tokenId] = form.watch(["tokenId"]);

  const { data: token } = useToken({
    tokenId,
    balanceCheckAccountId: viewer?.accountId,
  });

  const allocationScreenProps = useMemo(
    () => ({
      balanceFloat: token?.balanceFloat ?? 0.0,
      totalAmountFloat,
      matchingPots,
      ...props,
    }),

    [token?.balanceFloat, matchingPots, props, totalAmountFloat],
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
          return <DonationSingleRecipientAllocation form={form} {...allocationScreenProps} />;
        } else if ("potId" in allocationScreenProps || "listId" in allocationScreenProps) {
          return <DonationGroupAllocation form={form} {...allocationScreenProps} />;
        } else return defaultErrorScreen;
      }

      case "confirmation":
        return <DonationModalConfirmationScreen {...confirmationScreenProps} />;

      case "success":
        return <DonationSuccess {...successScreenProps} />;

      default:
        return defaultErrorScreen;
    }
  }, [allocationScreenProps, confirmationScreenProps, currentStep, form, successScreenProps]);

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
              disabled={isDisabled}
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
