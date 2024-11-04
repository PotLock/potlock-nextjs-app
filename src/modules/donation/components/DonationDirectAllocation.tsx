import { useMemo } from "react";

import { values } from "remeda";

import { Pot, indexer } from "@/common/api/indexer";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { ftService } from "@/common/services";
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
import { ModalErrorBody, useNearUsdDisplayValue } from "@/modules/core";
import { TokenBalance } from "@/modules/token";

import { DonationSybilWarning } from "./DonationSybilWarning";
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
  const [amount, tokenId, allocationStrategy, potId] = form.watch([
    "amount",
    "tokenId",
    "allocationStrategy",
    "potAccountId",
  ]);

  const { data: supportedFts = {} } = ftService.useSupportedTokens();

  const selectedFt = useMemo(
    () => supportedFts[tokenId],
    [supportedFts, tokenId],
  );

  console.log("selectedFt", selectedFt);

  const {
    isLoading: isRecipientDataLoading,
    data: recipient,
    error: recipientDataError,
  } = indexer.useAccount({ accountId });

  const isFtDonation =
    allocationStrategy !== DonationAllocationStrategyEnum.split &&
    tokenId !== NEAR_TOKEN_DENOM;

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
                      const disabled =
                        value === DonationAllocationStrategyEnum.split &&
                        !hasMatchingPots;

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

        {allocationStrategy === DonationAllocationStrategyEnum.split &&
          potId && <DonationSybilWarning {...{ potId }} />}

        {allocationStrategy === DonationAllocationStrategyEnum.split &&
          hasMatchingPots && (
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
              labelExtension={<TokenBalance tokenId={tokenId} />}
              inputExtension={
                <FormField
                  control={form.control}
                  name="tokenId"
                  render={({ field: inputExtension }) => (
                    <SelectField
                      embedded
                      label="Available tokens"
                      disabled={false}
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

                      {allocationStrategy ===
                        DonationAllocationStrategyEnum.full &&
                        Object.values(supportedFts).map(
                          ({ contract_account_id, metadata, balance }) =>
                            Number(balance) > 0 ? (
                              <SelectItem
                                key={contract_account_id}
                                value={contract_account_id}
                              >
                                {metadata.symbol}
                              </SelectItem>
                            ) : null,
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
      balanceFloat,
      form.control,
      hasMatchingPots,
      isBalanceSufficient,
      isFtDonation,
      isRecipientDataLoading,
      matchingPots,
      minAmountError,
      nearAmountUsdDisplayValue,
      potId,
      supportedFts,
      tokenId,
    ],
  );

  return recipientDataError ? (
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
