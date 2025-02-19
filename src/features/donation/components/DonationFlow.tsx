import { useMemo } from "react";

import { isBigSource } from "@/common/lib";
import { Button, DialogFooter, Form, ModalErrorBody } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { useWalletUserSession } from "@/common/wallet";
import { useToken } from "@/entities/_shared/token";
import { dispatch } from "@/store";

import { DonationConfirmation } from "./DonationConfirmation";
import { DonationDirectAllocation } from "./DonationDirectAllocation";
import { DonationGroupAllocation } from "./DonationGroupAllocation";
import { DonationSuccess, DonationSuccessProps } from "./DonationSuccess";
import { useDonationForm } from "../hooks";
import { useDonationState } from "../models";
import { DonationAllocationKey } from "../types";

export type DonationFlowProps = DonationAllocationKey &
  Pick<DonationSuccessProps, "transactionHash"> & {
    closeModal: VoidFunction;
  };

export const DonationFlow: React.FC<DonationFlowProps> = ({
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
          return <DonationDirectAllocation {...allocationScreenProps} />;
        } else if ("potId" in allocationScreenProps || "listId" in allocationScreenProps) {
          return <DonationGroupAllocation {...allocationScreenProps} />;
        } else return defaultErrorScreen;
      }

      case "confirmation":
        return <DonationConfirmation {...confirmationScreenProps} />;

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
