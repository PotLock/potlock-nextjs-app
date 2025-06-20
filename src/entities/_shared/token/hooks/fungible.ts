import { useMemo } from "react";

import { Big } from "big.js";

import { coingeckoHooks } from "@/common/api/coingecko";
import { intearTokenIndexerHooks } from "@/common/api/intear-token-indexer";
import { nearProtocolHooks } from "@/common/blockchains/near-protocol";
import { NATIVE_TOKEN_ID, PLATFORM_LISTED_TOKEN_IDS } from "@/common/constants";
import { refExchangeContractHooks } from "@/common/contracts/ref-finance";
import { ftContractHooks } from "@/common/contracts/tokens";
import { indivisibleUnitsToBigNum, indivisibleUnitsToFloat, isAccountId } from "@/common/lib";
import type { AccountId, ConditionalActivation } from "@/common/types";

import { type TokenQuery, type TokenQueryResult } from "../types";

export const useFungibleTokenAllowlist = ({ enabled = true }: ConditionalActivation) => {
  const { data: refFinanceTokenAllowlist } = refExchangeContractHooks.useWhitelistedTokens({
    enabled,
  });

  return useMemo(
    () => ({
      data: PLATFORM_LISTED_TOKEN_IDS.concat(refFinanceTokenAllowlist ?? []),
    }),

    [refFinanceTokenAllowlist],
  );
};

/**
 * Smart token data retrieval mechanism that supports both native token and fungible tokens.
 *
 * When `balanceCheckAccountId` is provided, the balance of the token is also retrieved.
 */
export const useFungibleToken = ({
  tokenId,
  balanceCheckAccountId,
  enabled = true,
}: TokenQuery & ConditionalActivation): TokenQueryResult => {
  const isValidFtContractAccountId = isAccountId(tokenId);
  const isValidTokenId = tokenId === NATIVE_TOKEN_ID || isValidFtContractAccountId;

  const {
    isLoading: isNtMetadataLoading,
    data: ntMetadata,
    error: ntMetadataError,
  } = nearProtocolHooks.useNativeTokenMetadata({
    disabled: !enabled || tokenId !== NATIVE_TOKEN_ID,
  });

  const {
    isLoading: isNtUsdPriceLoading,
    data: oneTokenUsdPrice,
    error: usdPriceError,
  } = coingeckoHooks.useNativeTokenUsdPrice({
    disabled: !enabled || tokenId !== NATIVE_TOKEN_ID,
  });

  const {
    isLoading: isAccountSummaryLoading,
    data: accountSummary,
    error: accountSummaryError,
  } = nearProtocolHooks.useViewAccount({
    disabled: !enabled || balanceCheckAccountId === undefined || tokenId !== NATIVE_TOKEN_ID,
    accountId: balanceCheckAccountId as AccountId,
  });

  const {
    isLoading: isFtMetadataLoading,
    data: ftMetadata,
    error: ftMetadataError,
  } = ftContractHooks.useFtMetadata({
    disabled: !enabled || !isValidFtContractAccountId,
    tokenId,
  });

  const {
    isLoading: isFtUsdPriceLoading,
    data: oneFtUsdPrice,
    error: ftUsdPriceError,
  } = intearTokenIndexerHooks.useTokenUsdPrice({
    disabled: !enabled || !isValidFtContractAccountId,
    tokenId,
  });

  const {
    isLoading: isFtBalanceLoading,
    data: ftBalance,
    error: ftBalanceError,
  } = ftContractHooks.useFtBalanceOf({
    disabled: balanceCheckAccountId === undefined || !isValidFtContractAccountId,
    accountId: balanceCheckAccountId as AccountId,
    tokenId,
  });

  return useMemo(() => {
    const isMetadataLoading = isNtMetadataLoading || isFtMetadataLoading;
    const isUsdPriceLoading = isFtUsdPriceLoading || isNtUsdPriceLoading;
    const isBalanceLoading = isAccountSummaryLoading || isFtBalanceLoading;

    const status = {
      isMetadataLoading,
      isUsdPriceLoading,
      isBalanceLoading,
      isLoading: isMetadataLoading || isUsdPriceLoading || isBalanceLoading,

      error: !isValidTokenId
        ? new Error(`Token ID ${tokenId} is invalid.`)
        : (ntMetadataError ??
          ftUsdPriceError ??
          accountSummaryError ??
          ftMetadataError ??
          usdPriceError ??
          ftBalanceError),
    };

    switch (tokenId) {
      case NATIVE_TOKEN_ID: {
        if (ntMetadata) {
          return {
            ...status,

            data: {
              tokenId,
              metadata: ntMetadata,
              usdPrice: oneTokenUsdPrice ? Big(oneTokenUsdPrice) : undefined,

              balance: accountSummary?.amount
                ? indivisibleUnitsToBigNum(accountSummary.amount, ntMetadata.decimals)
                : undefined,

              balanceFloat: accountSummary?.amount
                ? indivisibleUnitsToFloat(accountSummary.amount, ntMetadata.decimals)
                : undefined,

              balanceUsd:
                accountSummary?.amount && oneTokenUsdPrice
                  ? Big(accountSummary.amount).mul(oneTokenUsdPrice)
                  : undefined,
            },
          };
        } else return status;
      }

      default: {
        if (ftMetadata) {
          return {
            ...status,

            data: {
              tokenId,
              metadata: ftMetadata,
              usdPrice: oneFtUsdPrice ? Big(oneFtUsdPrice) : undefined,

              balance: ftBalance
                ? indivisibleUnitsToBigNum(ftBalance, ftMetadata.decimals)
                : undefined,

              balanceFloat: ftBalance
                ? indivisibleUnitsToFloat(ftBalance, ftMetadata.decimals)
                : undefined,

              balanceUsd:
                ftBalance && oneFtUsdPrice ? Big(ftBalance).mul(oneFtUsdPrice) : undefined,
            },
          };
        } else return status;
      }
    }
  }, [
    accountSummary?.amount,
    accountSummaryError,
    ftBalance,
    ftBalanceError,
    ftMetadata,
    ftMetadataError,
    ftUsdPriceError,
    isAccountSummaryLoading,
    isFtBalanceLoading,
    isFtMetadataLoading,
    isFtUsdPriceLoading,
    isNtMetadataLoading,
    isNtUsdPriceLoading,
    isValidTokenId,
    ntMetadata,
    ntMetadataError,
    oneFtUsdPrice,
    oneTokenUsdPrice,
    tokenId,
    usdPriceError,
  ]);
};
