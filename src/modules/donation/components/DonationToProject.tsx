import { useMemo } from "react";

import { dispatch } from "@/app/_store";
import { ByAccountId, potlock } from "@/common/api/potlock";
import {
  Button,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
} from "@/common/ui/components";

import { DonationAllocation } from "./DonationAllocation";
import { useDonationForm } from "../hooks/forms";
import { DonationState } from "../models";

export type DonationToProjectProps = ByAccountId &
  DonationState & {
    closeDialog: VoidFunction;
  };

export const DonationToProject: React.FC<DonationToProjectProps> = ({
  accountId,
  closeDialog: _,
  currentStep,
}) => {
  const {
    isLoading: isAccountLoading,
    data: account,
    error: accountError,
  } = potlock.useAccount({ accountId });

  const { form, onSubmit } = useDonationForm({
    allocation: "direct",
    accountId,
  });

  const content = useMemo(() => {
    switch (currentStep) {
      case "allocation":
        return <DonationAllocation {...{ form }} />;
      case "confirmation":
        return <></>;
      case "success":
        return <></>;
      default:
        return "Error: Unable to proceed with the next step";
    }
  }, [currentStep, form]);

  return isAccountLoading ? (
    <span
      un-flex="~"
      un-justify="center"
      un-items="center"
      un-w="full"
      un-h="40"
      un-text="2xl"
    >
      Loading...
    </span>
  ) : (
    <Form {...form}>
      <form {...{ onSubmit }}>
        {accountError && accountError.message}

        {account !== undefined && (
          <>
            {currentStep !== "success" && (
              <DialogHeader>
                <DialogTitle>
                  {currentStep === "confirmation"
                    ? "Confirm donation"
                    : `Donation to ${account.near_social_profile_data?.name}`}
                </DialogTitle>
              </DialogHeader>
            )}

            <DialogDescription asChild>{content}</DialogDescription>

            <DialogFooter>
              <Button
                type="button"
                variant="brand-outline"
                color="black"
                disabled
              >
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
          </>
        )}
      </form>
    </Form>
  );
};
