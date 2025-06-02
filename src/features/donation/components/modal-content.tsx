import { useMemo } from "react";

import { Button, DialogFooter, Form, ModalErrorBody } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { dispatch } from "@/store";

import { DonationGroupAllocation } from "./group-allocation";
import { DonationModalConfirmationScreen } from "./modal-confirmation-screen";
import { DonationSingleRecipientAllocation } from "./single-recipient-allocation";
import {
  DonationSingleRecipientSuccessScreen,
  DonationSingleRecipientSuccessScreenProps,
} from "./single-recipient-success";
import { type DonationFormParams, useDonationForm } from "../hooks/form";
import { useDonationState } from "../models/store";
import {
  DonationAllocationKey,
  type GroupDonationReceipts,
  type SingleRecipientDonationReceipt,
} from "../types";
import { DonationGroupAllocationSuccessScreen } from "./group-allocation-success";

export type DonationModalContentProps = DonationAllocationKey &
  Pick<DonationFormParams, "cachedTokenId"> &
  Pick<DonationSingleRecipientSuccessScreenProps, "transactionHash"> & {
    closeModal: VoidFunction;
  };

export const DonationModalContent: React.FC<DonationModalContentProps> = ({
  transactionHash,
  closeModal,
  ...props
}) => {
  const { currentStep, finalOutcome } = useDonationState();

  const { form, matchingPots, isDisabled, onSubmit, totalAmountFloat, isGroupDonation } =
    useDonationForm(props);

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
        if ("accountId" in props || "campaignId" in props) {
          return (
            <DonationSingleRecipientAllocation form={form} matchingPots={matchingPots} {...props} />
          );
        } else if ("potId" in props || "listId" in props) {
          return (
            <DonationGroupAllocation form={form} totalAmountFloat={totalAmountFloat} {...props} />
          );
        } else return defaultErrorScreen;
      }

      case "confirmation":
        return (
          <DonationModalConfirmationScreen
            form={form}
            totalAmountFloat={totalAmountFloat}
            campaignId={"campaignId" in props ? props.campaignId : null}
          />
        );

      case "success": {
        return isGroupDonation ? (
          <DonationGroupAllocationSuccessScreen
            {...successScreenProps}
            receipts={finalOutcome as GroupDonationReceipts}
          />
        ) : (
          <DonationSingleRecipientSuccessScreen
            {...successScreenProps}
            receipt={finalOutcome as SingleRecipientDonationReceipt}
          />
        );
      }

      default:
        return defaultErrorScreen;
    }
  }, [
    currentStep,
    finalOutcome,
    form,
    isGroupDonation,
    matchingPots,
    props,
    successScreenProps,
    totalAmountFloat,
  ]);

  return (
    <Form {...form}>
      <form className="flex h-full flex-col" {...{ onSubmit }}>
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
