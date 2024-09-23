import { useMemo } from "react";

import { values } from "remeda";

import { walletApi } from "@/common/api/near";
import { pagoda } from "@/common/api/pagoda";
import { Pot, potlock } from "@/common/api/potlock";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { ByAccountId } from "@/common/types";
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
  SelectItem,
  Skeleton,
} from "@/common/ui/components";
import {
  SelectField,
  SelectFieldOption,
  TextField,
} from "@/common/ui/form-fields";
import {
  AvailableTokenBalance,
  ModalErrorBody,
  useNearUsdDisplayValue,
} from "@/modules/core";

import { DonationVerificationWarning } from "./DonationVerificationWarning";
import {
  DONATION_INSUFFICIENT_BALANCE_ERROR,
  DONATION_MIN_NEAR_AMOUNT,
} from "../constants";
import {
  DonationAllocationInputs,
  donationAllocationStrategies,
} from "../models";
import { DonationAllocationStrategyEnum } from "../types";

export type DonationDirectAllocationProps = ByAccountId &
  DonationAllocationInputs & { matchingPots?: Pot[] };

export const DonationDirectAllocation: React.FC<
  DonationDirectAllocationProps
> = ({
  form,
  isBalanceSufficient,
  minAmountError,
  accountId,
  balanceFloat,
  matchingPots,
}) => {
  const [amount, tokenId, allocationStrategy] = form.watch([
    "amount",
    "tokenId",
    "allocationStrategy",
  ]);

  const { data: availableFts } = pagoda.useFtAccountBalances({
    accountId: walletApi.accountId,
  });

  const {
    isLoading: isRecipientDataLoading,
    data: recipient,
    error: recipientDataError,
  } = potlock.useAccount({ accountId });

  const isFtDonation =
    allocationStrategy !== "pot" && tokenId !== NEAR_TOKEN_DENOM;

  const nearAmountUsdDisplayValue = useNearUsdDisplayValue(amount);
  const hasMatchingPots = (matchingPots?.length ?? 0) > 0;

  const formLayout = useMemo(
    () => (
      <DialogDescription>
        <FormField
          control={form.control}
          name="allocationStrategy"
          render={({ field }) => (
            <FormItem className="gap-3">
              {isRecipientDataLoading ? (
                <Skeleton className="w-59 h-3.5" />
              ) : (
                <FormLabel className="font-600">
                  {"How do you want to allocate funds?"}
                </FormLabel>
              )}

              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {values(donationAllocationStrategies).map(
                    ({ label, hint, hintIfDisabled, value }) => {
                      const disabled = value === "pot" && !hasMatchingPots;

                      return (
                        <FormItem key={value}>
                          <RadioGroupItem
                            id={`donation-options-${value}`}
                            isLoading={isRecipientDataLoading}
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

        {allocationStrategy === "pot" && <DonationVerificationWarning />}

        {allocationStrategy === "pot" && hasMatchingPots && (
          <FormField
            control={form.control}
            name="potAccountId"
            render={({ field }) => (
              <SelectField
                label="Select Pot"
                defaultValue={field.value}
                onValueChange={field.onChange}
              >
                {matchingPots?.map(({ account: potAccountId, name }) => (
                  <SelectFieldOption key={potAccountId} value={potAccountId}>
                    {name}
                  </SelectFieldOption>
                ))}
              </SelectField>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <TextField
              label="Amount"
              {...field}
              labelExtension={<AvailableTokenBalance tokenId={tokenId} />}
              inputExtension={
                <FormField
                  control={form.control}
                  name="tokenId"
                  render={({ field: inputExtension }) => (
                    <SelectField
                      embedded
                      label="Available tokens"
                      disabled // TODO: FT donation is not yet finished
                      defaultValue={inputExtension.value}
                      onValueChange={inputExtension.onChange}
                      classes={{
                        trigger:
                          "mr-2px h-full w-min rounded-r-none shadow-none",
                      }}
                    >
                      <SelectItem value={NEAR_TOKEN_DENOM}>
                        {NEAR_TOKEN_DENOM.toUpperCase()}
                      </SelectItem>

                      {allocationStrategy === "direct" &&
                        availableFts?.map(
                          ({
                            contract_account_id: contractId,
                            metadata: { symbol },
                          }) => (
                            <SelectItem key={contractId} value={contractId}>
                              {symbol}
                            </SelectItem>
                          ),
                        )}
                    </SelectField>
                  )}
                />
              }
              type="number"
              placeholder="0.00"
              min={
                tokenId === NEAR_TOKEN_DENOM ? DONATION_MIN_NEAR_AMOUNT : 0.0
              }
              max={balanceFloat ?? undefined}
              step={0.01}
              appendix={isFtDonation ? null : nearAmountUsdDisplayValue}
              customErrorMessage={
                isBalanceSufficient
                  ? minAmountError
                  : DONATION_INSUFFICIENT_BALANCE_ERROR
              }
            />
          )}
        />
      </DialogDescription>
    ),

    [
      allocationStrategy,
      availableFts,
      balanceFloat,
      form.control,
      hasMatchingPots,
      isBalanceSufficient,
      isFtDonation,
      isRecipientDataLoading,
      matchingPots,
      minAmountError,
      nearAmountUsdDisplayValue,
      tokenId,
    ],
  );

  return recipientDataError !== undefined ? (
    <ModalErrorBody
      heading="Project donation"
      title="Unable to load recipient data!"
      message={recipientDataError?.message}
    />
  ) : (
    <>
      <DialogHeader>
        <DialogTitle>
          {`Donation to ${recipient?.near_social_profile_data?.name ?? "project"}`}
        </DialogTitle>
      </DialogHeader>

      {formLayout}
    </>
  );
};
