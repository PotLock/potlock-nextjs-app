import { useCallback, useMemo } from "react";

import { CheckedState } from "@radix-ui/react-checkbox";
import { values } from "remeda";

import { ByPotId, potlock } from "@/common/api/potlock";
import { NearIcon } from "@/common/assets/svgs";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { yoctoNearToFloat } from "@/common/lib";
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
  AvailableTokenBalance,
  ModalErrorBody,
  useNearUsdDisplayValue,
} from "@/modules/core";
import { DonationPotDistributionStrategyEnum } from "@/modules/donation";

import { DonationVerificationWarning } from "./DonationVerificationWarning";
import { DONATION_INSUFFICIENT_BALANCE_ERROR } from "../constants";
import {
  DonationAllocationInputs,
  DonationInputs,
  donationPotDistributionStrategies,
} from "../models";

export type DonationPotShareAllocationProps = ByPotId &
  DonationAllocationInputs & {};

export const DonationPotShareAllocation: React.FC<
  DonationPotShareAllocationProps
> = ({ form, isBalanceSufficient, balanceFloat, potId }) => {
  const [amount, tokenId, potShareAllocationStrategy, potDonationShares] =
    form.watch([
      "amount",
      "tokenId",
      "potShareAllocationStrategy",
      "potDonationShares",
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

  const totalAmount = useMemo(
    () =>
      potShareAllocationStrategy === "evenly" ? (
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <TextField
              label="Amount"
              {...field}
              labelExtension={<AvailableTokenBalance {...{ tokenId }} />}
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
        <div>
          <span className="prose">{"Total allocated"}</span>
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
    ],
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
                          DonationPotDistributionStrategyEnum[value]
                        }
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

    [form.control, isPotLoading],
  );

  const handleEvenStrategy = useCallback(
    (recipient: ByAccountId) => {
      const isAssigned =
        potDonationShares !== undefined &&
        potDonationShares.some(
          ({ account_id }) => account_id === recipient.accountId,
        );

      const recipientShareAmount = amount / (potDonationShares?.length ?? 1);

      return (assign: CheckedState) => {
        form.setValue(
          "potDonationShares",

          assign
            ? (potDonationShares ?? [])
                .concat(isAssigned ? [] : [{ account_id: recipient.accountId }])
                .map((recipientShare) => ({
                  ...recipientShare,
                  amount: recipientShareAmount,
                }))
            : (potDonationShares ?? []).reduce(
                (updatedShares = [], recipientShare) => {
                  return recipientShare.account_id === recipient.accountId
                    ? updatedShares
                    : updatedShares.concat([
                        {
                          account_id: recipient.accountId,
                          amount: recipientShareAmount,
                        },
                      ]);
                },

                [] as DonationInputs["potDonationShares"],
              ),
        );
      };
    },

    [amount, form, potDonationShares],
  );

  const handleManualStrategy = useCallback(
    (recipient: ByAccountId): React.ChangeEventHandler<HTMLInputElement> => {
      const isAssigned =
        potDonationShares !== undefined &&
        potDonationShares.some(
          ({ account_id }) => account_id === recipient.accountId,
        );

      return ({ target: { value } }) => {
        form.setValue(
          "potDonationShares",

          isAssigned
            ? potDonationShares.reduce(
                (updatedShares = [], recipientShare) => {
                  const recipientShareAmount = parseFloat(value);

                  return recipientShareAmount > 0
                    ? updatedShares.concat([
                        recipientShare.account_id === recipient.accountId
                          ? { ...recipientShare, amount: recipientShareAmount }
                          : recipientShare,
                      ])
                    : updatedShares.filter(
                        (recipientShare) =>
                          recipientShare.account_id !== recipient.accountId,
                      );
                },

                [] as DonationInputs["potDonationShares"],
              )
            : (potDonationShares ?? []).concat([
                { account_id: recipient.accountId, amount: parseFloat(value) },
              ]),
        );
      };
    },

    [form, potDonationShares],
  );

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
                        onCheckedChange={handleEvenStrategy({
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
                        onChange={handleManualStrategy({
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
      balanceFloat,
      form.control,
      handleManualStrategy,
      handleEvenStrategy,
      isBalanceSufficient,
      pot,
      potApplications,
      potShareAllocationStrategy,
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
        {totalAmount}
      </DialogDescription>

      <ScrollArea className="h-[190px] w-full">
        <div un-flex="~ col" un-items="center" un-gap="0.5">
          {recipientShares}
        </div>
      </ScrollArea>
    </>
  );
};
