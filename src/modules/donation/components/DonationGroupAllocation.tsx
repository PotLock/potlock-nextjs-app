import { useCallback, useMemo } from "react";

import { values } from "remeda";

import { ByPotId, potlock } from "@/common/api/potlock";
import { NearIcon } from "@/common/assets/svgs";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { yoctoNearToFloat } from "@/common/lib";
import { ByListId } from "@/common/types";
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
import { DonationGroupAllocationStrategyEnum, WithTotalAmount } from "../types";

export type DonationGroupAllocationProps = WithTotalAmount &
  DonationAllocationInputs &
  (ByPotId | ByListId);

export const DonationGroupAllocation: React.FC<
  DonationGroupAllocationProps
> = ({
  form,
  isBalanceSufficient,
  balanceFloat,
  totalAmountFloat,
  ...props
}) => {
  const isPotDonation = "potId" in props;
  const isListDonation = "listId" in props;
  const potId = isPotDonation ? props.potId : undefined;
  const listId = isListDonation ? props.listId : undefined;

  const [amount, tokenId, groupAllocationStrategy] = form.watch([
    "amount",
    "tokenId",
    "groupAllocationStrategy",
  ]);

  const {
    isLoading: isPotLoading,
    data: pot,
    error: potError,
  } = potlock.usePot({ potId });

  const { data: potApplications = [], error: potApplicationsError } =
    potlock.usePotApplications({ potId, page_size: 100 });

  const {
    data: list,
    isLoading: isListLoading,
    error: listError,
  } = potlock.useList({ listId });

  const { data: listRegistrations = [] } = potlock.useListRegistrations({
    listId,
  });

  const nearAmountUsdDisplayValue = useNearUsdDisplayValue(amount);

  const onEvenShareAllocationClick = useCallback(
    () => form.setValue("amount", totalAmountFloat),
    [form, totalAmountFloat],
  );

  const strategySelect = useMemo(
    () => (
      <FormField
        control={form.control}
        name="groupAllocationStrategy"
        render={({ field }) => (
          <FormItem className="gap-3">
            {isPotLoading || isListLoading ? (
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
                        isLoading={isPotLoading || isListLoading}
                        checked={
                          field.value ===
                          DonationGroupAllocationStrategyEnum[value]
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

    [form.control, isListLoading, isPotLoading, onEvenShareAllocationClick],
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
                groupAllocationStrategy === "evenly" ? (
                  <FormField
                    name="groupAllocationPlan"
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
                    name="groupAllocationPlan"
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
      groupAllocationStrategy,
      form.control,
      handleEvenShareAllocation,
      balanceFloat,
      handleManualShareAllocation,
      isBalanceSufficient,
    ],
  );

  const errorDetails = useMemo(() => {
    if (potError) {
      return {
        heading: "Pot donation",
        title: "Unable to load pot data!",
        message: potError.message,
      };
    } else if (potApplicationsError) {
      return {
        heading: "Pot donation",
        title: "Unable to load recipients' data!",
        message: potApplicationsError.message,
      };
    } else if (listError) {
      return {
        heading: "List donation",
        title: "Unable to load recipients' data!",
        message: listError.message,
      };
    } else return null;
  }, [listError, potApplicationsError, potError]);

  return errorDetails ? (
    <ModalErrorBody {...errorDetails} />
  ) : (
    <>
      <DialogHeader>
        {pot && (
          <DialogTitle>{`Donation to Projects in ${pot.name}`}</DialogTitle>
        )}

        {list && (
          <DialogTitle>{`Donation to Projects in ${list.name}`}</DialogTitle>
        )}
      </DialogHeader>

      <DialogDescription>
        {strategySelect}
        <DonationVerificationWarning />

        {groupAllocationStrategy ===
        DonationGroupAllocationStrategyEnum.evenly ? (
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
                  isBalanceSufficient
                    ? null
                    : DONATION_INSUFFICIENT_BALANCE_ERROR
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

            <TokenBalance
              {...{ tokenId }}
              classNames={{ amount: "text-base" }}
            />
          </div>
        )}
      </DialogDescription>

      <ScrollArea className="h-[190px] w-full">
        <div className="flex flex-col items-center gap-0.5">
          {recipientShares}
        </div>
      </ScrollArea>
    </>
  );
};
