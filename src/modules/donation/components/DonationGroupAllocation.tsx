import { useCallback, useMemo } from "react";

import { values } from "remeda";

import { indexer } from "@/common/api/indexer";
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
  SelectField,
  SelectFieldOption,
  TextField,
} from "@/common/ui/form-fields";
import { ModalErrorBody, useNearUsdDisplayValue } from "@/modules/core";
import { TokenBalance, TokenTotalValue } from "@/modules/token";

import { DonationRecipientShares } from "./DonationRecipientShares";
import { DonationSybilWarning } from "./DonationSybilWarning";
import { DONATION_INSUFFICIENT_BALANCE_ERROR } from "../constants";
import {
  DonationAllocationInputs,
  donationGroupAllocationStrategies,
} from "../models";
import {
  DonationGroupAllocationKey,
  DonationGroupAllocationStrategyEnum,
  WithTotalAmount,
} from "../types";

export type DonationGroupAllocationProps = WithTotalAmount &
  DonationGroupAllocationKey &
  DonationAllocationInputs & {};

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
  const potId = isPotDonation ? props.potId : undefined;

  const [amount, tokenId, listId, groupAllocationStrategy] = form.watch([
    "amount",
    "tokenId",
    "listId",
    "groupAllocationStrategy",
  ]);

  const isListDonation = listId !== undefined;

  const {
    isLoading: isPotLoading,
    data: pot,
    error: potError,
  } = indexer.usePot({ potId });

  const {
    data: list,
    isLoading: isListLoading,
    error: listError,
  } = indexer.useList({ listId });

  const nearAmountUsdDisplayValue = useNearUsdDisplayValue(amount);

  const onEvenShareAllocationClick = useCallback(
    () => form.setValue("amount", totalAmountFloat, { shouldDirty: true }),
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
                {values(donationGroupAllocationStrategies).map(
                  ({ label, hint, hintIfDisabled, value }) => (
                    <FormItem key={value}>
                      <RadioGroupItem
                        id={`group-allocation-strategy-${value}`}
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

  const errorDetails = useMemo(() => {
    if (potError) {
      return {
        heading: "Pot donation",
        title: "Unable to load pot data!",
        message: potError.message,
      };
    } else if (listError) {
      return {
        heading: "List donation",
        title: "Unable to load list data!",
        message: listError.message,
      };
    } else return null;
  }, [listError, potError]);

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
        {potId && <DonationSybilWarning {...{ potId }} />}

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
          {isPotDonation && (
            <DonationRecipientShares
              {...{ balanceFloat, isBalanceSufficient, form }}
              potId={props.potId}
            />
          )}

          {isListDonation && (
            <DonationRecipientShares
              {...{ balanceFloat, isBalanceSufficient, form }}
              listId={listId}
            />
          )}
        </div>
      </ScrollArea>
    </>
  );
};
