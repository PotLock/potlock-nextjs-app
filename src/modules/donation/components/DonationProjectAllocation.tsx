import { useMemo } from "react";

import { UseFormReturn } from "react-hook-form";

import { pagoda } from "@/common/api/pagoda";
import { ByAccountId, potlock } from "@/common/api/potlock";
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

export type DonationProjectAllocationProps = ByAccountId & {
  form: UseFormReturn<DonationInputs>;
};

export const DonationProjectAllocation: React.FC<
  DonationProjectAllocationProps
> = ({ accountId, form }) => {
  const tokenId = form.watch("tokenId");
  const { data: activePots } = potlock.useAccountActivePots({ accountId });
  const hasMatchingPots = (activePots?.length ?? 0) > 0;
  const isFtDonation = tokenId !== NEAR_TOKEN_DENOM;

  const {
    isLoading: isAccountLoading,
    data: account,
    error: accountError,
  } = potlock.useAccount({ accountId });

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
            (ftBalance) => ftBalance.contract_account_id === tokenId,
          )
        : availableNearBalance) ?? null,

    [availableFtBalances, availableNearBalance, isFtDonation, tokenId],
  );

  return isAccountLoading || availableBalance === null ? (
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
          <DialogHeader>
            <DialogTitle>
              {`Donation to ${account.near_social_profile_data?.name}`}
            </DialogTitle>
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
                    {`${availableBalance.amount} ${availableBalance.metadata.symbol}`}
                  </span>

                  <span className="prose" un-text="sm neutral-600">
                    available
                  </span>
                </div>
              }
              fieldExtension={
                <Select defaultValue={tokenId}>
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
                tokenId === NEAR_TOKEN_DENOM ? DONATION_MIN_NEAR_AMOUNT : 0.0
              }
              step={0.01}
              appendix="$ 0.00"
            />
          </DialogDescription>
        </>
      )}
    </>
  );
};