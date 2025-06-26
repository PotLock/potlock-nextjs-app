import { useMemo } from "react";

import { values } from "remeda";

import { FEATURE_REGISTRY } from "@/common/_config";
import { Pot, indexer } from "@/common/api/indexer";
import { NOOP_STRING } from "@/common/constants";
import { campaignsContractHooks } from "@/common/contracts/core/campaigns";
import { parseNumber } from "@/common/lib";
import { ByAccountId, ByCampaignId } from "@/common/types";
import { SelectField, SelectFieldOption, TextField } from "@/common/ui/form/components";
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
} from "@/common/ui/layout/components";
import { useWalletUserSession } from "@/common/wallet";
import { useAccountSocialProfile } from "@/entities/_shared/account";
import { TokenBalance, TokenSelector, useFungibleToken } from "@/entities/_shared/token";

import { DonationHumanVerificationAlert } from "./human-verification-alert";
import { DONATION_ALLOCATION_STRATEGIES } from "../constants";
import { DonationAllocationInputs } from "../models/schemas";
import { DonationAllocationStrategyEnum } from "../types";

export type DonationSingleRecipientAllocationProps = Partial<ByAccountId> &
  Partial<ByCampaignId> &
  DonationAllocationInputs & { matchingPots?: Pot[] };

export const DonationSingleRecipientAllocation: React.FC<
  DonationSingleRecipientAllocationProps
> = ({ form, accountId, matchingPots, campaignId }) => {
  const walletUser = useWalletUserSession();

  const [amount, tokenId, allocationStrategy, potAccountId] = form.watch([
    "amount",
    "tokenId",
    "allocationStrategy",
    "potAccountId",
  ]);

  const { data: token } = useFungibleToken({
    tokenId,
    balanceCheckAccountId: walletUser?.accountId,
  });

  const {
    isLoading: isRecipientProfileLoading,
    profile: recipientProfile,
    error: recipientProfileError,
  } = useAccountSocialProfile({
    enabled: accountId !== undefined,
    accountId: accountId ?? NOOP_STRING,
  });

  const hasMatchingPots = (matchingPots?.length ?? 0) > 0;
  const isCampaignDonation = campaignId !== undefined;

  const { isLoading: isCampaignDataLoading, data: campaign } = campaignsContractHooks.useCampaign({
    enabled: isCampaignDonation,
    campaignId: campaignId ?? 0,
  });

  const isFtSelectorAvailable =
    FEATURE_REGISTRY.FtDonation.isEnabled &&
    (isCampaignDonation ? false : allocationStrategy === DonationAllocationStrategyEnum.full);

  const totalAmountUsdValue = useMemo(
    () =>
      token?.usdPrice === undefined
        ? null
        : `~$ ${token.usdPrice.mul(parseNumber(amount ?? 0)).toFixed(2)}`,

    [amount, token?.usdPrice],
  );

  const strategySelector = useMemo(
    () =>
      isCampaignDonation ? null : (
        <FormField
          control={form.control}
          name="allocationStrategy"
          render={({ field }) => (
            <FormItem className="gap-3">
              {isRecipientProfileLoading ? (
                <Skeleton className="w-59 h-3.5" />
              ) : (
                <FormLabel className="font-600">{"How do you want to allocate funds?"}</FormLabel>
              )}

              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                  {values(DONATION_ALLOCATION_STRATEGIES).map(
                    ({ label, hint, hintIfDisabled, value }) => {
                      const disabled =
                        value === DonationAllocationStrategyEnum.share && !hasMatchingPots;

                      return (
                        <FormItem key={value}>
                          <RadioGroupItem
                            id={`donation-options-${value}`}
                            isLoading={isRecipientProfileLoading}
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

    [form.control, hasMatchingPots, isCampaignDonation, isRecipientProfileLoading],
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

  return recipientProfileError ? (
    <ModalErrorBody
      heading="Project donation"
      title="Unable to load recipient data!"
      message={recipientProfileError?.message}
    />
  ) : (
    <>
      <DialogHeader>
        <DialogTitle>
          {isCampaignDonation
            ? `Donate to ${campaign?.name ? `${campaign.name} Campaign` : "Campaign"}`
            : `Donate to ${recipientProfile?.name ?? accountId}`}
        </DialogTitle>
      </DialogHeader>

      <DialogDescription>
        {strategySelector}

        {allocationStrategy === DonationAllocationStrategyEnum.share && potAccountId && (
          <DonationHumanVerificationAlert potId={potAccountId} />
        )}

        {potSelector}

        {isCampaignDonation && isCampaignDataLoading ? (
          <Skeleton className="h-17.5 w-full" />
        ) : (
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
                        disabled={!isFtSelectorAvailable}
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
        )}
      </DialogDescription>
    </>
  );
};
