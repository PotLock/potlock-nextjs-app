import { useCallback, useMemo } from "react";

import { values } from "remeda";

import { FEATURE_REGISTRY } from "@/common/_config";
import { indexer } from "@/common/api/indexer";
import { TextField } from "@/common/ui/form/components";
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
} from "@/common/ui/layout/components";
import { useWalletUserSession } from "@/common/wallet";
import { TokenBalance, TokenSelector, TokenValueSummary, useToken } from "@/entities/_shared/token";

import { DonationGroupAllocationRecipients } from "./group-allocation-recipients";
import { DonationHumanVerificationAlert } from "./human-verification-alert";
import { DONATION_GROUP_ALLOCATION_STRATEGIES } from "../constants";
import { DonationAllocationInputs } from "../models/schemas";
import {
  DonationGroupAllocationKey,
  DonationGroupAllocationStrategyEnum,
  WithTotalAmount,
} from "../types";

export type DonationGroupAllocationProps = WithTotalAmount &
  DonationGroupAllocationKey &
  DonationAllocationInputs & {};

export const DonationGroupAllocation: React.FC<DonationGroupAllocationProps> = ({
  form,
  totalAmountFloat,
  ...props
}) => {
  const viewer = useWalletUserSession();
  const isPotDonation = "potId" in props;
  const potIdFormParam = isPotDonation ? props.potId : undefined;
  const isListDonation = "listId" in props;
  const listIdFormParam = isListDonation ? props.listId : undefined;

  const [tokenId, groupAllocationStrategy] = form.watch(["tokenId", "groupAllocationStrategy"]);
  const amountError = useMemo(() => form.formState.errors.amount, [form.formState.errors.amount]);

  const { data: token } = useToken({
    tokenId,
    balanceCheckAccountId: viewer?.accountId,
  });

  const {
    isLoading: isPotLoading,
    data: pot,
    error: potError,
  } = indexer.usePot({ enabled: isPotDonation, potId: potIdFormParam ?? "noop" });

  const {
    data: list,
    isLoading: isListLoading,
    error: listError,
  } = indexer.useList({ enabled: isListDonation, listId: listIdFormParam ?? 0 });

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
                {values(DONATION_GROUP_ALLOCATION_STRATEGIES).map(
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
        {isPotDonation && <DonationHumanVerificationAlert potId={props.potId} />}

        {groupAllocationStrategy === DonationGroupAllocationStrategyEnum.even ? (
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <TextField
                label="Amount"
                {...field}
                onClick={undefined}
                onBlur={undefined}
                onFocus={undefined}
                labelExtension={<TokenBalance {...{ tokenId }} />}
                inputExtension={
                  <FormField
                    control={form.control}
                    name="tokenId"
                    render={({ field: inputExtension }) => (
                      <TokenSelector
                        hideZeroBalanceOptions
                        disabled={isPotDonation ? !FEATURE_REGISTRY.PotFtDonation.isEnabled : true}
                        defaultValue={inputExtension.value}
                        onValueChange={inputExtension.onChange}
                      />
                    )}
                  />
                }
                type="number"
                placeholder="0.00"
                min={0}
                max={token?.balanceFloat ?? undefined}
                step={0.01}
                appendix={totalAmountUsdValue}
              />
            )}
          />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="prose">{"Total allocated"}</span>
              <TokenValueSummary textOnly amountFloat={totalAmountFloat} {...{ tokenId }} />

              {amountError && (
                <p className="text-destructive text-sm font-medium">
                  {amountError.message ?? "Invalid amount."}
                </p>
              )}
            </div>

            <TokenBalance {...{ tokenId }} classNames={{ amount: "text-base" }} />
          </div>
        )}
      </DialogDescription>

      <ScrollArea className="h-49 w-full">
        <div className="flex w-full flex-col items-center gap-0.5">
          {isPotDonation && <DonationGroupAllocationRecipients potId={props.potId} form={form} />}

          {isListDonation && (
            <DonationGroupAllocationRecipients listId={props.listId} form={form} />
          )}
        </div>
      </ScrollArea>
    </>
  );
};
