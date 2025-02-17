import { useMemo } from "react";

import { values } from "remeda";

import { FEATURE_REGISTRY } from "@/common/_config";
import { Pot, indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { ByAccountId, ByCampaignId } from "@/common/types";
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
  Skeleton,
} from "@/common/ui/components";
import { SelectField, SelectFieldOption, TextField } from "@/common/ui/form-fields";
import { TokenSelector, useToken } from "@/entities/_shared/token";

import { DonationSybilWarning } from "./DonationSybilWarning";
import { DONATION_INSUFFICIENT_BALANCE_ERROR, DONATION_MIN_NEAR_AMOUNT } from "../constants";
import { DonationAllocationInputs, donationAllocationStrategies } from "../models";
import { DonationAllocationStrategyEnum } from "../types";
import { DonationTokenBalance } from "./DonationTokenBalance";

export type DonationDirectAllocationProps = Partial<ByAccountId> &
  Partial<ByCampaignId> &
  DonationAllocationInputs & { matchingPots?: Pot[] };

export const DonationDirectAllocation: React.FC<DonationDirectAllocationProps> = ({
  form,
  isBalanceSufficient,
  minAmountError,
  accountId,
  balanceFloat,
  matchingPots,
  campaignId,
}) => {
  const [amount, tokenId, allocationStrategy, potAccountId] = form.watch([
    "amount",
    "tokenId",
    "allocationStrategy",
    "potAccountId",
  ]);

  const { data: token } = useToken({ tokenId });

  const {
    isLoading: isRecipientDataLoading,
    data: recipient,
    error: recipientDataError,
  } = indexer.useAccount({
    enabled: accountId !== undefined,
    accountId: accountId ?? "noop",
  });

  const hasMatchingPots = (matchingPots?.length ?? 0) > 0;
  const isCampaignDonation = campaignId !== undefined;

  const isFtSupportAvailable =
    FEATURE_REGISTRY.DirectFtDonation.isEnabled &&
    !isCampaignDonation &&
    allocationStrategy === DonationAllocationStrategyEnum.full;

  const totalAmountUsdValue =
    amount && token?.usdPrice ? `~$ ${token.usdPrice.mul(amount).toFixed(2)}` : null;

  const strategySelector = useMemo(
    () =>
      isCampaignDonation ? null : (
        <FormField
          control={form.control}
          name="allocationStrategy"
          render={({ field }) => (
            <FormItem className="gap-3">
              {isRecipientDataLoading ? (
                <Skeleton className="w-59 h-3.5" />
              ) : (
                <FormLabel className="font-600">{"How do you want to allocate funds?"}</FormLabel>
              )}

              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                  {values(donationAllocationStrategies).map(
                    ({ label, hint, hintIfDisabled, value }) => {
                      const disabled =
                        value === DonationAllocationStrategyEnum.share && !hasMatchingPots;

                      return (
                        <FormItem key={value}>
                          <RadioGroupItem
                            id={`donation-options-${value}`}
                            isLoading={isRecipientDataLoading}
                            checked={field.value === DonationAllocationStrategyEnum[value]}
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
      ),

    [form.control, hasMatchingPots, isCampaignDonation, isRecipientDataLoading],
  );

  const potSelector = useMemo(
    () =>
      allocationStrategy === DonationAllocationStrategyEnum.share &&
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
              {matchingPots?.map(({ account: optionAccountId, name }) => (
                <SelectFieldOption key={optionAccountId} value={optionAccountId}>
                  {name}
                </SelectFieldOption>
              ))}
            </SelectField>
          )}
        />
      ),

    [allocationStrategy, form.control, hasMatchingPots, matchingPots],
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
          {isCampaignDonation
            ? "Donate to Campaign"
            : `Donation to ${recipient?.near_social_profile_data?.name ?? "project"}`}
        </DialogTitle>
      </DialogHeader>

      <DialogDescription>
        {strategySelector}

        {allocationStrategy === DonationAllocationStrategyEnum.share && potAccountId && (
          <DonationSybilWarning potId={potAccountId} />
        )}

        {potSelector}

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
                      disabled={!isFtSupportAvailable}
                      defaultValue={inputExtension.value}
                      onValueChange={inputExtension.onChange}
                    />
                  )}
                />
              }
              type="number"
              placeholder="0.00"
              min={tokenId === NATIVE_TOKEN_ID ? DONATION_MIN_NEAR_AMOUNT : 0.0}
              max={balanceFloat ?? undefined}
              step={0.01}
              appendix={totalAmountUsdValue}
              customErrorMessage={
                isBalanceSufficient ? minAmountError : DONATION_INSUFFICIENT_BALANCE_ERROR
              }
            />
          )}
        />
      </DialogDescription>
    </>
  );
};
