import { useMemo } from "react";

import { dispatch } from "@/app/_store";
import { ByAccountId, potlock } from "@/common/api/potlock";
import {
  Button,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  TextField,
} from "@/common/ui/components";

import { useProjectDonationForm } from "../hooks/project-donation";
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

  const { data: activePots } = potlock.useAccountActivePots({ accountId });
  const hasMatchingPots = (activePots?.length ?? 0) > 0;

  const { onSubmit, ...form } = useProjectDonationForm({});

  const content = useMemo(() => {
    switch (currentStep) {
      case "allocation":
        return (
          <div>
            <div un-flex="~ col" un-gap="3">
              <div className="prose" un-font="600" un-text="neutral-950">
                How do you want to allocate funds?
              </div>

              <RadioGroup>
                <RadioGroupItem
                  id="donation-options-direct"
                  label="Direct donation"
                  value="direct"
                  checked
                />

                <RadioGroupItem
                  id="donation-options-matched"
                  label="Quadratically matched donation"
                  hint={hasMatchingPots ? undefined : "(no pots available)"}
                  value="matched"
                  disabled={!hasMatchingPots}
                />
              </RadioGroup>
            </div>

            <TextField
              label="Amount"
              labelExtension={
                <div un-flex="~" un-gap="1">
                  <span
                    className="prose"
                    un-text="sm neutral-950"
                    un-font="600"
                  >
                    200 NEAR
                  </span>

                  <span className="prose" un-text="sm  neutral-600">
                    available
                  </span>
                </div>
              }
              fieldExtension={
                <Select defaultValue="near">
                  <SelectTrigger className="h-full w-min rounded-r-none shadow-none">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Available tokens</SelectLabel>
                      <SelectItem value="near">NEAR</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              }
              type="number"
              placeholder="0.00"
              min={0}
              step={0.01}
              appendix="$ 0.00"
            />
          </div>
        );
      case "confirmation":
        return <></>;
      case "done":
        return <></>;
      default:
        return "Error: Unable to proceed with the next step";
    }
  }, [currentStep, hasMatchingPots]);

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
    <>
      {accountError && accountError.message}

      {account !== undefined && (
        <>
          {currentStep !== "done" && (
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
            <Button variant="brand-outline" color="black" disabled>
              Add to cart
            </Button>

            <Button
              variant="brand-filled"
              onClick={
                currentStep === "confirmation"
                  ? onSubmit
                  : dispatch.donation.handleNextStep
              }
            >
              Proceed to donate
            </Button>
          </DialogFooter>
        </>
      )}
    </>
  );
};
