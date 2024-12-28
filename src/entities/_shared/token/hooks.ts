import { useMemo } from "react";

import { Big } from "big.js";

import { coingeckoHooks } from "@/common/api/coingecko";
import { intearPricesHooks } from "@/common/api/intear-prices";
import { nearHooks } from "@/common/api/near";
import { NATIVE_TOKEN_ID, PLATFORM_LISTED_TOKEN_IDS } from "@/common/constants";
import { refExchangeHooks } from "@/common/contracts/ref-finance";
import { ftHooks } from "@/common/contracts/tokens";
import { isAccountId, stringifiedU128ToBigNum, stringifiedU128ToFloat } from "@/common/lib";
import { formatWithCommas } from "@/common/lib/formatWithCommas";
import type { ByTokenId } from "@/common/types";

import { type TokenQuery, type TokenQueryResult } from "./types";

/**
 * @deprecated Use `usdPrice` Big number from `useToken({ tokenId: ... })`
 */
export const useTokenUsdDisplayValue = ({
  amountFloat,
  tokenId,
}: ByTokenId & {
  amountFloat: number;
}): string | null => {
  const { data: token } = useToken({ tokenId });

  const value = token ? parseFloat(token.usdPrice?.mul(amountFloat).toFixed(2) ?? "0") : 0;

  return useMemo(() => (isNaN(value) ? null : `~$ ${formatWithCommas(value.toString())}`), [value]);
};

export const useTokenAllowlist = () => {
  const { data: refFinanceTokenAllowlist } = refExchangeHooks.useWhitelistedTokens();

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
export const useToken = ({ tokenId, balanceCheckAccountId }: TokenQuery): TokenQueryResult => {
  const isValidFtContractAccountId = isAccountId(tokenId);
  const isValidTokenId = tokenId === NATIVE_TOKEN_ID || isValidFtContractAccountId;

  const {
    isLoading: isNtMetadataLoading,
    data: ntMetadata,
    error: ntMetadataError,
  } = nearHooks.useNativeTokenMetadata({ disabled: tokenId !== NATIVE_TOKEN_ID });

  const {
    isLoading: isNtUsdPriceLoading,
    data: oneTokenUsdPrice,
    error: usdPriceError,
  } = coingeckoHooks.useNativeTokenUsdPrice({ disabled: tokenId !== NATIVE_TOKEN_ID });

  const {
    isLoading: isAccountSummaryLoading,
    data: accountSummary,
    error: accountSummaryError,
  } = nearHooks.useViewAccount({
    accountId: balanceCheckAccountId ?? "noop",
    disabled: balanceCheckAccountId === undefined || tokenId !== NATIVE_TOKEN_ID,
  });

  const {
    isLoading: isFtMetadataLoading,
    data: ftMetadata,
    error: ftMetadataError,
  } = ftHooks.useFtMetadata({ disabled: !isValidFtContractAccountId, tokenId });

  const {
    isLoading: isFtUsdPriceLoading,
    data: oneFtUsdPrice,
    error: ftUsdPriceError,
  } = intearPricesHooks.useTokenUsdPrice({
    tokenId,
    disabled: !isValidFtContractAccountId,
  });

  const {
    isLoading: isFtBalanceLoading,
    data: ftBalance,
    error: ftBalanceError,
  } = ftHooks.useFtBalanceOf({
    accountId: balanceCheckAccountId ?? "noop",
    disabled: balanceCheckAccountId === undefined || !isValidFtContractAccountId,
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
                ? stringifiedU128ToBigNum(accountSummary.amount, ntMetadata.decimals)
                : undefined,

              balanceFloat: accountSummary?.amount
                ? stringifiedU128ToFloat(accountSummary.amount, ntMetadata.decimals)
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
                ? stringifiedU128ToBigNum(ftBalance, ftMetadata.decimals)
                : undefined,

              balanceFloat: ftBalance
                ? stringifiedU128ToFloat(ftBalance, ftMetadata.decimals)
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
