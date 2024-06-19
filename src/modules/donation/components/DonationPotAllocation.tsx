import { useMemo } from "react";

import { UseFormReturn } from "react-hook-form";

import { pagoda } from "@/common/api/pagoda";
import { ByPotId, potlock } from "@/common/api/potlock";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { walletApi } from "@/common/contracts";
import {
  DialogDescription,
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

import { DONATION_MIN_NEAR_AMOUNT } from "../constants";
import { DonationInputs } from "../models";

export type DonationPotAllocationProps = ByPotId & {
  form: UseFormReturn<DonationInputs>;
};

export const DonationPotAllocation: React.FC<DonationPotAllocationProps> = ({
  potId,
  form,
}) => {
  const token = form.watch("token");
  const isFtDonation = token !== NEAR_TOKEN_DENOM;

  const {
    isLoading: isPotLoading,
    data: pot,
    error: potError,
  } = potlock.usePot({ potId });

  const { data: { balance: availableNearBalance = null } = {} } =
    pagoda.useNearAccountBalance({
      accountId: walletApi.accountId ?? "unknown",
    });

  const { data: { balances: availableFtBalances = null } = {} } =
    pagoda.useFtAccountBalances({
      accountId: walletApi.accountId ?? "unknown",
    });

  const availableBalance = useMemo(
    () =>
      (isFtDonation
        ? availableFtBalances?.find(
            (ftBalance) => ftBalance.contract_account_id === token,
          )
        : availableNearBalance) ?? null,

    [availableFtBalances, availableNearBalance, isFtDonation, token],
  );

  return isPotLoading || availableBalance === null ? (
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
      {potError && potError.message}

      {pot !== undefined && (
        <>
          <DialogHeader>
            <DialogTitle>{`Donation to Projects in ${pot.name}`}</DialogTitle>
          </DialogHeader>

          <DialogDescription>
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
                  hint={"(...)"}
                  value="matched"
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
                    {`${availableBalance.amount} ${availableBalance.metadata.symbol}`}
                  </span>

                  <span className="prose" un-text="sm neutral-600">
                    available
                  </span>
                </div>
              }
              fieldExtension={
                <Select defaultValue={token}>
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
              min={token === NEAR_TOKEN_DENOM ? DONATION_MIN_NEAR_AMOUNT : 0.0}
              step={0.01}
              appendix="$ 0.00"
            />
          </DialogDescription>
        </>
      )}
    </>
  );
};
