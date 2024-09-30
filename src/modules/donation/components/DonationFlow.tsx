import { useMemo } from "react";

import { useRouteQuery } from "@/common/lib";
import { Button, DialogFooter, Form } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { ModalErrorBody } from "@/modules/core";
import { useTokenBalance } from "@/modules/token";
import { dispatch } from "@/store";

import { DonationConfirmation } from "./DonationConfirmation";
import { DonationDirectAllocation } from "./DonationDirectAllocation";
import { DonationGroupAllocation } from "./DonationGroupAllocation";
import { DonationSuccess, DonationSuccessProps } from "./DonationSuccess";
import { useDonationForm } from "../hooks";
import { DonationAllocationKey, DonationState } from "../types";

export type DonationFlowProps = DonationAllocationKey &
  DonationState &
  Pick<DonationSuccessProps, "transactionHash"> & {
    closeModal: VoidFunction;
  };

export const DonationFlow: React.FC<DonationFlowProps> = ({
  currentStep,
  finalOutcome: result,
  transactionHash,
  closeModal,
  ...props
}) => {
  const {
    query: { referrerId: referrerIdSearchParam },
  } = useRouteQuery();

  const {
    form,
    isBalanceSufficient,
    matchingPots,
    minAmountError,
    isDisabled,
    onSubmit,
    totalAmountFloat,
  } = useDonationForm({
    ...props,

    referrerAccountId:
      typeof referrerIdSearchParam === "string"
        ? referrerIdSearchParam
        : result?.referrer_id ?? undefined,
  });

  const inputs = form.watch();
  const { balanceFloat } = useTokenBalance(inputs);

  const allocationScreenProps = useMemo(
    () => ({
      form,
      isBalanceSufficient,
      minAmountError,
      balanceFloat,
      totalAmountFloat,
      matchingPots,
      ...inputs,
      ...props,
    }),

    [
      balanceFloat,
      form,
      inputs,
      isBalanceSufficient,
      matchingPots,
      minAmountError,
      props,
      totalAmountFloat,
    ],
  );

  const content = useMemo(() => {
    const successScreenProps = { form, result, transactionHash, closeModal };

    const defaultErrorScreen = (
      <ModalErrorBody
        heading="Donation"
        title="Unable to proceed with the next step."
      />
    );

    switch (currentStep) {
      case "allocation": {
        if ("accountId" in allocationScreenProps) {
          return <DonationDirectAllocation {...allocationScreenProps} />;
        } else if (
          "potId" in allocationScreenProps ||
          "listId" in allocationScreenProps
        ) {
          return <DonationGroupAllocation {...allocationScreenProps} />;
        } else return defaultErrorScreen;
      }

      case "confirmation":
        return <DonationConfirmation {...{ form, totalAmountFloat }} />;

      case "success":
        return <DonationSuccess {...successScreenProps} />;

      default:
        return defaultErrorScreen;
    }
  }, [
    allocationScreenProps,
    closeModal,
    currentStep,
    form,
    result,
    totalAmountFloat,
    transactionHash,
  ]);

  return (
    <Form {...form}>
      <form un-flex="~ col" un-h="full" {...{ onSubmit }}>
        {content}

        {currentStep !== "success" && (
          <DialogFooter>
            {currentStep === "allocation" && (
              <Button
                type="button"
                variant="brand-outline"
                color="black"
                disabled
              >
                {"Add to cart"}
              </Button>
            )}

            <Button
              type="button"
              variant="brand-filled"
              onClick={
                currentStep === "confirmation"
                  ? onSubmit
                  : dispatch.donation.nextStep
              }
              disabled={isDisabled}
              className={cn({ "w-full": currentStep === "confirmation" })}
            >
              {currentStep === "confirmation"
                ? "Confirm donation"
                : "Proceed to donate"}
            </Button>
          </DialogFooter>
        )}
      </form>
    </Form>
  );
};
