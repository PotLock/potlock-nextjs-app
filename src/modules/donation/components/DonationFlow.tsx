import { createElement as h, useMemo } from "react";

import { useSearchParams } from "next/navigation";

import { dispatch } from "@/app/_store";
import { Button, DialogFooter, Form } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { ModalErrorBody, useAvailableBalance } from "@/modules/core";

import { DonationConfirmation } from "./DonationConfirmation";
import { DonationPotAllocation } from "./DonationPotAllocation";
import { DonationProjectAllocation } from "./DonationProjectAllocation";
import { DonationSuccess } from "./DonationSuccess";
import { useDonationForm } from "../hooks/forms";
import { DonationState, DonationSubmissionInputs } from "../models";

export type DonationFlowProps = DonationSubmissionInputs &
  DonationState & {
    closeModal: VoidFunction;
  };

export const DonationFlow: React.FC<DonationFlowProps> = ({
  currentStep,
  successResult: result,
  ...props
}) => {
  const searchParams = useSearchParams();
  const transactionHashes = searchParams.get("transactionHashes");

  const { isBalanceSufficient, minAmountError, form, isDisabled, onSubmit } =
    useDonationForm({
      ...props,

      referrerAccountId:
        searchParams.get("referrerId") ?? result?.recipient_id ?? undefined,
    });

  const [tokenId] = form.watch(["tokenId"]);

  const { balanceFloat } = useAvailableBalance({ tokenId });

  const content = useMemo(() => {
    const staticAllocationProps = {
      isBalanceSufficient,
      minAmountError,
      balanceFloat,
      form,
    };

    const staticSuccessProps = { form, result, transactionHashes };

    switch (currentStep) {
      case "allocation":
        return "accountId" in props
          ? h(DonationProjectAllocation, { ...staticAllocationProps, ...props })
          : h(DonationPotAllocation, { ...staticAllocationProps, ...props });

      case "confirmation":
        return <DonationConfirmation {...{ form }} />;

      case "success":
        return <DonationSuccess {...staticSuccessProps} />;

      default:
        return (
          <ModalErrorBody
            heading="Donation"
            title="Unable to proceed with the next step."
          />
        );
    }
  }, [
    balanceFloat,
    currentStep,
    form,
    isBalanceSufficient,
    minAmountError,
    props,
    result,
    transactionHashes,
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
                Add to cart
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
              className={cn({
                "w-full": currentStep === "confirmation",
              })}
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
