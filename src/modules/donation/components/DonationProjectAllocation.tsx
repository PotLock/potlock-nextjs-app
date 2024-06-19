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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import {
  RuntimeErrorAlert,
  balanceToFloat,
  balanceToString,
  useNearUsdDisplayValue,
} from "@/modules/core";

import { DONATION_MIN_NEAR_AMOUNT } from "../constants";
import {
  DonationAllocationStrategyEnum,
  DonationInputs,
  donationAllocationStrategies,
} from "../models";

export type DonationProjectAllocationProps = ByAccountId & {
  form: UseFormReturn<DonationInputs>;
};

export const DonationProjectAllocation: React.FC<
  DonationProjectAllocationProps
> = ({ accountId, form }) => {
  const [amount, token] = form.watch(["amount", "token"]);
  const { data: activePots } = potlock.useAccountActivePots({ accountId });
  const hasMatchingPots = (activePots?.length ?? 0) > 0;
  const isFtDonation = token !== NEAR_TOKEN_DENOM;

  const {
    isLoading: isAccountLoading,
    data: account,
    error: accountError,
  } = potlock.useAccount({ accountId });

  const {
    isLoading: isNearBalanceLoading,
    data: { balance: availableNearBalance = null } = {},
    error: nearBalanceError,
  } = pagoda.useNearAccountBalance({
    accountId: walletApi.accountId ?? "unknown",
  });

  const {
    isLoading: isFtBalanceLoading,
    data: { balances: availableFtBalances = null } = {},
    error: ftBalancesError,
  } = pagoda.useFtAccountBalances({
    accountId: walletApi.accountId ?? "unknown",
  });

  const dataFetchError = accountError ?? nearBalanceError ?? ftBalancesError;

  const availableBalance = useMemo(
    () =>
      (isFtDonation
        ? availableFtBalances?.find(
            (ftBalance) => ftBalance.contract_account_id === token,
          )
        : availableNearBalance) ?? null,

    [availableFtBalances, availableNearBalance, isFtDonation, token],
  );

  const availableBalanceFloat = useMemo(
    () =>
      availableBalance === null
        ? null
        : balanceToFloat(
            availableBalance?.amount,
            availableBalance?.metadata.decimals,
          ),

    [availableBalance],
  );

  const nearAmountUsdDisplayValue = useNearUsdDisplayValue(amount);

  return isAccountLoading || isNearBalanceLoading || isFtBalanceLoading ? (
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
      {dataFetchError && (
        <DialogHeader className="w-full rounded-lg">
          <RuntimeErrorAlert customMessage={dataFetchError.message} />
        </DialogHeader>
      )}

      {account !== undefined && (
        <>
          <DialogHeader>
            <DialogTitle>
              {`Donation to ${account.near_social_profile_data?.name}`}
            </DialogTitle>
          </DialogHeader>

          <DialogDescription>
            <FormField
              control={form.control}
              name="allocationStrategy"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3">
                  <FormLabel>How do you want to allocate funds?</FormLabel>

                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {Object.values(donationAllocationStrategies).map(
                        ({ label, hint, hintIfDisabled, value }) => {
                          const disabled = value === "pot" && !hasMatchingPots;

                          return (
                            <FormItem key={value}>
                              <RadioGroupItem
                                id={`donation-options-${value}`}
                                checked={
                                  field.value ===
                                  DonationAllocationStrategyEnum[value]
                                }
                                hint={disabled ? hintIfDisabled : hint}
                                {...{ disabled, label, value }}
                              />
                            </FormItem>
                          );
                        },
                      )}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <TextField
                  label="Amount"
                  {...field}
                  labelExtension={
                    availableBalance === null ? (
                      <span className="prose" un-text="sm destructive">
                        Unable to load available balance!
                      </span>
                    ) : (
                      <div un-flex="~" un-gap="1">
                        <span
                          className="prose"
                          un-text="sm neutral-950"
                          un-font="600"
                        >
                          {balanceToString(availableBalance)}
                        </span>

                        <span className="prose" un-text="sm neutral-600">
                          available
                        </span>
                      </div>
                    )
                  }
                  fieldExtension={
                    <FormField
                      control={form.control}
                      name="token"
                      render={({ field: fieldExtension }) => (
                        <Select
                          defaultValue={fieldExtension.value}
                          onValueChange={fieldExtension.onChange}
                        >
                          <SelectTrigger className="h-full w-min rounded-r-none shadow-none">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Available tokens</SelectLabel>

                              <SelectItem value={NEAR_TOKEN_DENOM}>
                                {NEAR_TOKEN_DENOM.toUpperCase()}
                              </SelectItem>

                              {availableFtBalances?.map(
                                ({
                                  contract_account_id: contractId,
                                  metadata: { symbol },
                                }) => (
                                  <SelectItem
                                    key={contractId}
                                    value={contractId}
                                  >
                                    {symbol}
                                  </SelectItem>
                                ),
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  }
                  type="number"
                  placeholder="0.00"
                  min={
                    token === NEAR_TOKEN_DENOM ? DONATION_MIN_NEAR_AMOUNT : 0.0
                  }
                  max={availableBalanceFloat ?? undefined}
                  step={0.01}
                  appendix={isFtDonation ? null : nearAmountUsdDisplayValue}
                />
              )}
            />
          </DialogDescription>
        </>
      )}
    </>
  );
};
