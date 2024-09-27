import { useCallback, useMemo } from "react";

import { values } from "remeda";

import { ByPotId, potlock } from "@/common/api/potlock";
import { NearIcon } from "@/common/assets/svgs";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { yoctoNearToFloat } from "@/common/lib";
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
  ScrollArea,
  Skeleton,
} from "@/common/ui/components";
import {
  CheckboxField,
  SelectField,
  SelectFieldOption,
  TextField,
} from "@/common/ui/form-fields";
import {
  AccountOption,
  ModalErrorBody,
  useNearUsdDisplayValue,
} from "@/modules/core";
import { TokenBalance, TokenTotalValue } from "@/modules/token";

import { DonationVerificationWarning } from "./DonationVerificationWarning";
import { DONATION_INSUFFICIENT_BALANCE_ERROR } from "../constants";
import {
  useDonationEvenShareAllocation,
  useDonationManualShareAllocation,
} from "../hooks";
import {
  DonationAllocationInputs,
  donationPotDistributionStrategies,
} from "../models";
import { DonationShareAllocationStrategyEnum, WithTotalAmount } from "../types";

export type DonationPotShareAllocationProps = DonationAllocationInputs &
  ByPotId &
  WithTotalAmount;

export const DonationPotShareAllocation: React.FC<
  DonationPotShareAllocationProps
> = ({ form, isBalanceSufficient, balanceFloat, potId, totalAmountFloat }) => {
  const [amount, tokenId, potShareAllocationStrategy] = form.watch([
    "amount",
    "tokenId",
    "potShareAllocationStrategy",
  ]);

  const {
    isLoading: isPotLoading,
    data: pot,
    error: potError,
  } = potlock.usePot({ potId });

  const {
    isLoading: isPotApplicationListLoading,
    data: { results: potApplications } = { results: [] },
    error: potApplicationsError,
  } = potlock.usePotApplications({ potId, page_size: 100 });

  const isLoading = isPotLoading || isPotApplicationListLoading;
  const error = potError ?? potApplicationsError;
  const nearAmountUsdDisplayValue = useNearUsdDisplayValue(amount);

  const onEvenShareAllocationClick = useCallback(
    () => form.setValue("amount", totalAmountFloat),
    [form, totalAmountFloat],
  );

  const strategy = useMemo(
    () => (
      <FormField
        control={form.control}
        name="potShareAllocationStrategy"
        render={({ field }) => (
          <FormItem className="gap-3">
            {isPotLoading ? (
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
                {values(donationPotDistributionStrategies).map(
                  ({ label, hint, hintIfDisabled, value }) => (
                    <FormItem key={value}>
                      <RadioGroupItem
                        id={`donation-options-${value}`}
                        isLoading={isPotLoading}
                        checked={
                          field.value ===
                          DonationShareAllocationStrategyEnum[value]
                        }
                        onClick={onEvenShareAllocationClick}
                        hint={field.disabled ? hintIfDisabled : hint}
                        disabled={field.disabled}
                        {...{ label, value }}
                      />
                    </FormItem>
                  ),
                )}
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
    ),

    [form.control, isPotLoading, onEvenShareAllocationClick],
  );

  const totalAmountField = useMemo(
    () =>
      potShareAllocationStrategy ===
      DonationShareAllocationStrategyEnum.evenly ? (
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <TextField
              label="Amount"
              {...field}
              labelExtension={<TokenBalance {...{ tokenId }} />}
              inputExtension={
                <FormField
                  control={form.control}
                  name="tokenId"
                  render={({ field: inputExtension }) => (
                    <SelectField
                      embedded
                      label="Available tokens"
                      disabled //? FT donation is not supported in pots
                      defaultValue={inputExtension.value}
                      onValueChange={inputExtension.onChange}
                      classes={{
                        trigger:
                          "mr-2px h-full w-min rounded-r-none shadow-none",
                      }}
                    >
                      <SelectFieldOption value={NEAR_TOKEN_DENOM}>
                        {NEAR_TOKEN_DENOM.toUpperCase()}
                      </SelectFieldOption>
                    </SelectField>
                  )}
                />
              }
              type="number"
              placeholder="0.00"
              min={yoctoNearToFloat(
                pot?.min_matching_pool_donation_amount ?? "0",
              )}
              max={balanceFloat ?? undefined}
              step={0.01}
              appendix={nearAmountUsdDisplayValue}
              customErrorMessage={
                isBalanceSufficient ? null : DONATION_INSUFFICIENT_BALANCE_ERROR
              }
            />
          )}
        />
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="prose">{"Total allocated"}</span>

            <TokenTotalValue
              textOnly
              amountFloat={totalAmountFloat}
              {...{ tokenId }}
            />
          </div>

          <TokenBalance {...{ tokenId }} classNames={{ amount: "text-base" }} />
        </div>
      ),

    [
      balanceFloat,
      form.control,
      isBalanceSufficient,
      nearAmountUsdDisplayValue,
      pot?.min_matching_pool_donation_amount,
      potShareAllocationStrategy,
      tokenId,
      totalAmountFloat,
    ],
  );

  const handleEvenShareAllocation = useDonationEvenShareAllocation({
    form,
    totalAmountFloat,
  });

  const handleManualShareAllocation = useDonationManualShareAllocation({
    form,
  });

  const recipientShares = useMemo(
    () =>
      pot
        ? potApplications.map(({ applicant: recipientCandidate }) => (
            <AccountOption
              key={recipientCandidate.id}
              accountId={recipientCandidate.id}
              secondaryAction={
                potShareAllocationStrategy === "evenly" ? (
                  <FormField
                    name="potDonationShares"
                    control={form.control}
                    render={({ field: { value = [], ...field } }) => (
                      <CheckboxField
                        {...field}
                        checked={value.some(
                          (recipient) =>
                            recipient.account_id === recipientCandidate.id &&
                            recipient.amount !== undefined,
                        )}
                        onCheckedChange={handleEvenShareAllocation({
                          accountId: recipientCandidate.id,
                        })}
                      />
                    )}
                  />
                ) : (
                  <FormField
                    name="potDonationShares"
                    control={form.control}
                    render={({ field: { value = [], ...field } }) => (
                      <TextField
                        {...field}
                        type="number"
                        placeholder="0.00"
                        min={0}
                        max={balanceFloat ?? undefined}
                        step={0.01}
                        defaultValue={
                          value.find(
                            (recipient) =>
                              recipient.account_id === recipientCandidate.id,
                          )?.amount
                        }
                        onChange={handleManualShareAllocation({
                          accountId: recipientCandidate.id,
                        })}
                        appendix={<NearIcon width={24} height={24} />}
                        customErrorMessage={
                          isBalanceSufficient
                            ? null
                            : DONATION_INSUFFICIENT_BALANCE_ERROR
                        }
                        classNames={{ fieldRoot: "w-32" }}
                      />
                    )}
                  />
                )
              }
            />
          ))
        : null,

    [
      pot,
      potApplications,
      potShareAllocationStrategy,
      form.control,
      handleEvenShareAllocation,
      balanceFloat,
      handleManualShareAllocation,
      isBalanceSufficient,
    ],
  );

  return error ? (
    <ModalErrorBody
      heading="Pot donation"
      title="Unable to load pot data!"
      message={error.message}
    />
  ) : (
    <>
      {isLoading && (
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
      )}

      {pot && (
        <DialogHeader>
          <DialogTitle>{`Donation to Projects in ${pot.name}`}</DialogTitle>
        </DialogHeader>
      )}

      <DialogDescription>
        {strategy}
        <DonationVerificationWarning />
        {totalAmountField}
      </DialogDescription>

      <ScrollArea className="h-[190px] w-full">
        <div un-flex="~ col" un-items="center" un-gap="0.5">
          {recipientShares}
        </div>
      </ScrollArea>
    </>
  );
};
