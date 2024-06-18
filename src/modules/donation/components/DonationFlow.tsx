import { useMemo } from "react";

import { dispatch } from "@/app/_store";
import { Button, DialogFooter, Form } from "@/common/ui/components";

import { DonationPotAllocation } from "./DonationPotAllocation";
import { DonationProjectAllocation } from "./DonationProjectAllocation";
import { useDonationForm } from "../hooks/forms";
import { DonationState, DonationSubmissionInputs } from "../models";

export type DonationFlowProps = DonationSubmissionInputs &
  DonationState & {
    closeDialog: VoidFunction;
  };

export const DonationFlow: React.FC<DonationFlowProps> = ({
  closeDialog: _,
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
        return <></>;

      case "success":
        return <></>;

      default:
        return "Error: Unable to proceed with the next step";
    }
  }, [currentStep, form, props]);

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
