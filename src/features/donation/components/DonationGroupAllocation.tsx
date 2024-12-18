import { useCallback, useMemo } from "react";

import { values } from "remeda";

import { indexer } from "@/common/api/indexer";
import { yoctoNearToFloat } from "@/common/lib";
import { tokenHooks } from "@/common/services/token";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  ModalErrorBody,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
  Skeleton,
} from "@/common/ui/components";
import { TextField } from "@/common/ui/form-fields";
import { TokenSelector, TokenTotalValue } from "@/entities/token";

import { DonationRecipientShares } from "./DonationRecipientShares";
import { DonationSybilWarning } from "./DonationSybilWarning";
import { DONATION_INSUFFICIENT_BALANCE_ERROR } from "../constants";
import { DonationAllocationInputs, donationGroupAllocationStrategies } from "../models";
import {
  DonationGroupAllocationKey,
  DonationGroupAllocationStrategyEnum,
  WithTotalAmount,
} from "../types";
import { DonationTokenBalance } from "./DonationTokenBalance";

export type DonationGroupAllocationProps = WithTotalAmount &
  DonationGroupAllocationKey &
  DonationAllocationInputs & {};

export const DonationGroupAllocation: React.FC<DonationGroupAllocationProps> = ({
  form,
  isBalanceSufficient,
  balanceFloat,
  totalAmountFloat,
  ...props
}) => {
  const isPotDonation = "potId" in props;
  const potId = isPotDonation ? props.potId : undefined;

  const [tokenId, listId, groupAllocationStrategy] = form.watch([
    "tokenId",
    "listId",
    "groupAllocationStrategy",
  ]);

  const isListDonation = listId !== undefined;
  const { data: token } = tokenHooks.useToken({ tokenId });
  const { isLoading: isPotLoading, data: pot, error: potError } = indexer.usePot({ potId });
  const { data: list, isLoading: isListLoading, error: listError } = indexer.useList({ listId });

  const totalAmountUsdValue = token?.usdPrice
    ? `~$ ${token.usdPrice.mul(totalAmountFloat).toFixed(2)}`
    : null;

  const onEvenShareAllocationClick = useCallback(
    () => form.setValue("amount", totalAmountFloat, { shouldDirty: true }),
    [form, totalAmountFloat],
  );

  const strategySelector = useMemo(
    () => (
      <FormField
        control={form.control}
        name="groupAllocationStrategy"
        render={({ field }) => (
          <FormItem className="gap-3">
            {isPotLoading || isListLoading ? (
              <Skeleton className="w-59 h-3.5" />
            ) : (
              <FormLabel className="font-600">{"How do you want to allocate funds?"}</FormLabel>
            )}

            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                {values(donationGroupAllocationStrategies).map(
                  ({ label, hint, hintIfDisabled, value }) => (
                    <FormItem key={value}>
                      <RadioGroupItem
                        id={`group-allocation-strategy-${value}`}
                        isLoading={isPotLoading || isListLoading}
                        checked={field.value === DonationGroupAllocationStrategyEnum[value]}
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
        {pot && <DialogTitle>{`Donation to Projects in ${pot.name}`}</DialogTitle>}

        {list && <DialogTitle>{`Donation to Projects in ${list.name}`}</DialogTitle>}
      </DialogHeader>

      <DialogDescription>
        {strategySelector}
        {potId && <DonationSybilWarning {...{ potId }} />}

        {groupAllocationStrategy === DonationGroupAllocationStrategyEnum.evenly ? (
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <TextField
                label="Amount"
                {...field}
                labelExtension={<DonationTokenBalance {...{ tokenId }} />}
                inputExtension={
                  <FormField
                    control={form.control}
                    name="tokenId"
                    render={({ field: inputExtension }) => (
                      <TokenSelector
                        /**
                         *? INFO: pots only support NEAR donations, which is the default token
                         *?  in this form already. Please make sure the last part stays that way.
                         */
                        disabled
                        defaultValue={inputExtension.value}
                        onValueChange={inputExtension.onChange}
                      />
                    )}
                  />
                }
                type="number"
                placeholder="0.00"
                min={yoctoNearToFloat(pot?.min_matching_pool_donation_amount ?? "0")}
                max={balanceFloat ?? undefined}
                step={0.01}
                appendix={totalAmountUsdValue}
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

              <TokenTotalValue textOnly amountFloat={totalAmountFloat} {...{ tokenId }} />
            </div>

            <DonationTokenBalance {...{ tokenId }} classNames={{ amount: "text-base" }} />
          </div>
        )}
      </DialogDescription>

      <ScrollArea className="h-49 w-full">
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
