import { createElement as h, useMemo } from "react";

import { dispatch } from "@/app/_store";
import {
  Button,
  DialogFooter,
  DialogHeader,
  Form,
} from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { RuntimeErrorAlert } from "@/modules/core";

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
  closeModal,
  currentStep,
  ...props
}) => {
  const { form, onSubmit } = useDonationForm(props);

  const content = useMemo(() => {
    switch (currentStep) {
      case "allocation":
        return "accountId" in props
          ? h(DonationProjectAllocation, { form, ...props })
          : h(DonationPotAllocation, { form, ...props });

      case "confirmation":
        return h(DonationConfirmation, { form });

      case "success":
        return h(DonationSuccess, { closeModal });

      default:
        return (
          <DialogHeader className="w-full rounded-lg">
            <RuntimeErrorAlert customMessage="Unable to proceed with the next step." />
          </DialogHeader>
        );
    }
  }, [closeModal, currentStep, form, props]);

  return (
    <Form {...form}>
      <form {...{ onSubmit }}>
        {content}

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
            type={currentStep === "confirmation" ? "submit" : "button"}
            variant="brand-filled"
            onClick={
              currentStep === "confirmation"
                ? undefined
                : dispatch.donation.nextStep
            }
            className={cn({
              "w-full": currentStep === "confirmation",
            })}
          >
            {currentStep === "confirmation"
              ? "Confirm donation"
              : "Proceed to donate"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
