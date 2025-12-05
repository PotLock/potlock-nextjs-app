import { useEffect, useMemo, useState } from "react";

import { values } from "remeda";

import { FEATURE_REGISTRY } from "@/common/_config";
import { Pot } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID, NOOP_STRING } from "@/common/constants";
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

import { CrossChainAmountEntry } from "./cross-chain-amount-entry";
import { CrossChainTokenAvatar } from "./cross-chain-token-avatar";
import { CrossChainTokenSelector } from "./cross-chain-token-selector";
import { DonationHumanVerificationAlert } from "./human-verification-alert";
import { DONATION_ALLOCATION_STRATEGIES } from "../constants";
import { useCrossChainToken } from "../hooks/cross-chain-tokens";
import { DonationAllocationInputs } from "../models/schemas";
import { DonationAllocationStrategyEnum } from "../types";

export type DonationSingleRecipientAllocationProps = Partial<ByAccountId> &
  Partial<ByCampaignId> &
  DonationAllocationInputs & {
    matchingPots?: Pot[];
    onTokenDataChange?: (data: { blockchain: string; tokenData?: any } | null) => void;
  };

export const DonationSingleRecipientAllocation: React.FC<
  DonationSingleRecipientAllocationProps
> = ({ form, accountId, matchingPots, campaignId, onTokenDataChange }) => {
  const walletUser = useWalletUserSession();

  const [selectedTokenData, setSelectedTokenData] = useState<{
    blockchain: string;
    tokenData?: any;
  } | null>(null);

  const [amount, tokenId, allocationStrategy, potAccountId] = form.watch([
    "amount",
    "tokenId",
    "allocationStrategy",
    "potAccountId",
  ]);

  // Check if tokenId is a cross-chain token (format: "blockchain:assetId")
  const isCrossChainToken =
    tokenId !== undefined && tokenId !== NATIVE_TOKEN_ID && tokenId.includes(":");

  // Only fetch token data for NEAR tokens, not cross-chain tokens (to avoid balance loading errors)
  const { data: token } = useFungibleToken({
    tokenId: isCrossChainToken ? NATIVE_TOKEN_ID : (tokenId ?? NATIVE_TOKEN_ID),
    balanceCheckAccountId: isCrossChainToken ? undefined : walletUser?.accountId,
    enabled: !isCrossChainToken,
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

  // Check if cross-chain donations are allowed
  // - For campaigns: only ongoing campaigns without end date
  // - For account donations: always allowed (no restrictions)
  const isCrossChainAllowed = useMemo(() => {
    if (process.env.NEXT_PUBLIC_ENV === "test") {
      return false;
    }

    if (isCampaignDonation) {
      return campaign?.end_ms == null;
    }

    // Allow cross-chain for account donations (projects)
    return accountId !== undefined;
  }, [isCampaignDonation, campaign?.end_ms, accountId]);

  // Enable token selector for campaigns to allow cross-chain donations
  // For non-campaign donations, only enable if allocation strategy is full
  const isFtSelectorAvailable =
    FEATURE_REGISTRY.FtDonation.isEnabled &&
    (isCampaignDonation ? true : allocationStrategy === DonationAllocationStrategyEnum.full);

  // Check if we need to show cross-chain flow (non-NEAR token selected for campaign)
  const isCrossChainDonation = useMemo(() => {
    return isCampaignDonation && tokenId !== NATIVE_TOKEN_ID && tokenId !== undefined;
  }, [isCampaignDonation, tokenId]);

  // Restore selectedTokenData when component mounts with a cross-chain token selected
  const [blockchain, assetId] = useMemo(() => {
    if (tokenId && tokenId.includes(":")) {
      const parts = tokenId.split(":");
      return [parts[0], parts.slice(1).join(":")];
    }

    return [undefined, undefined];
  }, [tokenId]);

  const { data: restoredTokenData } = useCrossChainToken(blockchain, assetId);

  useEffect(() => {
    if (isCrossChainToken && !selectedTokenData && restoredTokenData && blockchain && assetId) {
      const tokenDataObj = {
        blockchain: blockchain.toLowerCase(),
        tokenData: restoredTokenData,
      };

      setSelectedTokenData(tokenDataObj);

      if (onTokenDataChange) {
        onTokenDataChange(tokenDataObj);
      }
    }
  }, [
    isCrossChainToken,
    selectedTokenData,
    restoredTokenData,
    blockchain,
    assetId,
    onTokenDataChange,
  ]);

  const totalAmountUsdValue = useMemo(() => {
    if (!amount || parseFloat(amount.toString()) === 0) return null;

    // For cross-chain tokens, use price from selectedTokenData
    if (isCrossChainToken && selectedTokenData?.tokenData?.price) {
      const usdValue = parseFloat(amount.toString()) * selectedTokenData.tokenData.price;
      return `~$ ${usdValue.toFixed(2)}`;
    }

    // For NEAR tokens, use price from token hook
    if (token?.usdPrice) {
      return `~$ ${token.usdPrice.mul(parseNumber(amount ?? 0)).toFixed(2)}`;
    }

    return null;
  }, [amount, token?.usdPrice, isCrossChainToken, selectedTokenData]);

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

  // Store selected token data for cross-chain flow (will be used when proceeding)

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
                labelExtension={
                  isCrossChainToken && selectedTokenData ? (
                    <CrossChainTokenAvatar
                      blockchain={selectedTokenData.blockchain}
                      tokenSymbol={selectedTokenData.tokenData?.symbol}
                    />
                  ) : (
                    <TokenBalance {...{ tokenId }} />
                  )
                }
                inputExtension={
                  <FormField
                    control={form.control}
                    name="tokenId"
                    render={({ field: inputExtension }) =>
                      isCrossChainAllowed ? (
                        <CrossChainTokenSelector
                          disabled={!isFtSelectorAvailable}
                          defaultValue={inputExtension.value}
                          onTokenChange={(value, blockchain, tokenData) => {
                            inputExtension.onChange(value);

                            // Store token data for later use, but don't trigger cross-chain flow yet
                            const tokenDataObj =
                              value !== NATIVE_TOKEN_ID ? { blockchain, tokenData } : null;

                            setSelectedTokenData(tokenDataObj);

                            if (onTokenDataChange) {
                              onTokenDataChange(tokenDataObj);
                            }
                          }}
                        />
                      ) : (
                        <TokenSelector
                          hideBalances={!isCampaignDonation}
                          showBalanceOnlyForNative={isCampaignDonation}
                          disabled={!isFtSelectorAvailable}
                          defaultValue={inputExtension.value}
                          onValueChange={(value) => {
                            inputExtension.onChange(value);
                          }}
                        />
                      )
                    }
                  />
                }
                type="number"
                placeholder="0.00"
                min={0}
                max={isCrossChainToken ? undefined : (token?.balanceFloat ?? undefined)}
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
