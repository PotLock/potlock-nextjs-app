import { useMemo } from "react";

import { dispatch } from "@/app/_store";
import {
  Button,
  DialogFooter,
  DialogHeader,
  Form,
} from "@/common/ui/components";
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
        return "accountId" in props ? (
          <DonationProjectAllocation
            accountId={props.accountId}
            {...{ form }}
          />
        ) : (
          <DonationPotAllocation potId={props.potId} {...{ form }} />
        );

      case "confirmation":
        return <DonationConfirmation {...{ form }} />;

      case "success":
        return <DonationSuccess {...{ closeModal }} />;

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
          <Button type="button" variant="brand-outline" color="black" disabled>
            Add to cart
          </Button>

          <Button
            type={currentStep === "confirmation" ? "submit" : "button"}
            variant="brand-filled"
            onClick={
              currentStep === "confirmation"
                ? undefined
                : dispatch.donation.nextStep
            }
          >
            Proceed to donate
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
