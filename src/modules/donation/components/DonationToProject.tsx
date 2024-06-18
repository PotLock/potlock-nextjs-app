import { useMemo } from "react";

import { dispatch } from "@/app/_store";
import { pagoda } from "@/common/api/pagoda";
import { ByAccountId, potlock } from "@/common/api/potlock";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { walletApi } from "@/common/contracts";
import {
  Button,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
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

import { DONATION_MIN_NEAR_AMOUNT } from "../constants";
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

  const { data: activePots } = potlock.useAccountActivePots({ accountId });
  const hasMatchingPots = (activePots?.length ?? 0) > 0;

  const { availableBalance, form, onSubmit, values } = useDonationForm({});

  console.table(availableBalance);

  const content = useMemo(() => {
    switch (currentStep) {
      case "allocation":
        return (
          <>
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
                    {"200 NEAR"}
                  </span>

                  <span className="prose" un-text="sm neutral-600">
                    available
                  </span>
                </div>
              }
              fieldExtension={
                <Select defaultValue={values.tokenId}>
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
              min={
                values.tokenId === NEAR_TOKEN_DENOM
                  ? DONATION_MIN_NEAR_AMOUNT
                  : 0.0
              }
              step={0.01}
              appendix="$ 0.00"
            />
          </>
        );
      case "confirmation":
        return <></>;
      case "done":
        return <></>;
      default:
        return "Error: Unable to proceed with the next step";
    }
  }, [currentStep, hasMatchingPots, values.tokenId]);

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

          <Form {...form}>
            <DialogDescription asChild>
              <form {...{ onSubmit }}>{content}</form>
            </DialogDescription>
          </Form>

          <DialogFooter>
            <Button variant="brand-outline" color="black" disabled>
              Add to cart
            </Button>

            <Button
              variant="brand-filled"
              onClick={
                currentStep === "confirmation"
                  ? onSubmit
                  : dispatch.donation.nextStep
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
