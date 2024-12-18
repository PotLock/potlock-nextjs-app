import { useMemo } from "react";

import { Big } from "big.js";
import useSWR from "swr";

import { coingeckoClient } from "@/common/api/coingecko";
import { intearPricesHooks } from "@/common/api/intear-prices";
import { nearHooks } from "@/common/api/near";
import { NATIVE_TOKEN_ID, PLATFORM_LISTED_TOKEN_IDS } from "@/common/constants";
import { refExchangeHooks } from "@/common/contracts/ref-finance";
import { ftHooks } from "@/common/contracts/tokens";
import { isAccountId, stringifiedU128ToBigNum, stringifiedU128ToFloat } from "@/common/lib";
import { formatWithCommas } from "@/common/lib/formatWithCommas";
import type { AccountId, ByTokenId, WithDisabled } from "@/common/types";

import { type TokenData } from "./types";

export const useAllowlist = () => {
  const { data: refFinanceTokenAllowlist } = refExchangeHooks.useWhitelistedTokens();

  return useMemo(
    () => ({
      data: PLATFORM_LISTED_TOKEN_IDS.concat(refFinanceTokenAllowlist ?? []),
    }),

    [refFinanceTokenAllowlist],
  );
};

export const useTokenUsdPrice = ({ tokenId, disabled = false }: ByTokenId & WithDisabled) => {
  const {
    isLoading: isNativeTokenPriceLoading,
    data: oneNativeTokenUsdPrice,
    error: nativeTokenPriceError,
  } = useSWR(
    () => (disabled || tokenId !== NATIVE_TOKEN_ID ? null : ["oneNativeTokenUsdPrice", tokenId]),

    ([_queryKey, tokenKey]) =>
      coingeckoClient
        .get(`/simple/price?ids=${tokenKey}&vs_currencies=usd`)
        .then((response: { data: { [key: string]: { usd: number } } }) =>
          response.data[tokenKey].usd.toString(),
        ),
  );

  const {
    isLoading: isFungibleTokenPriceLoading,
    data: oneFungibleTokenUsdPrice,
    error: fungibleTokenPriceError,
  } = intearPricesHooks.useTokenUsdPrice({
    tokenId,
    disabled: disabled || tokenId === NATIVE_TOKEN_ID,
  });

  return tokenId === NATIVE_TOKEN_ID
    ? {
        isLoading: isNativeTokenPriceLoading,
        data: oneNativeTokenUsdPrice,
        error: nativeTokenPriceError,
      }
    : {
        isLoading: isFungibleTokenPriceLoading,
        data: oneFungibleTokenUsdPrice,
        error: fungibleTokenPriceError,
      };
};

export interface SupportedTokenQuery extends ByTokenId {
  balanceCheckAccountId?: AccountId;
}

export type SupportedTokenQueryResult = {
  isLoading: boolean;
  isUsdPriceLoading: boolean;
  isBalanceLoading: boolean;
  data?: TokenData;
  error?: Error;
};

/**
 * Smart token data retrieval mechanism that supports both native token and fungible tokens.
 *
 * When `balanceCheckAccountId` is provided, the balance of the token is also retrieved.
 */
export const useSupportedToken = ({
  tokenId,
  balanceCheckAccountId,
}: SupportedTokenQuery): SupportedTokenQueryResult => {
  const isValidFtContractAccountId = isAccountId(tokenId);

  const {
    isLoading: isNtMetadataLoading,
    data: ntMetadata,
    error: ntMetadataError,
  } = nearHooks.useNativeTokenMetadata({ disabled: tokenId !== NATIVE_TOKEN_ID });

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
    isLoading: isFtBalanceLoading,
    data: ftBalance,
    error: ftBalanceError,
  } = ftHooks.useFtBalanceOf({
    accountId: balanceCheckAccountId ?? "noop",
    disabled: balanceCheckAccountId === undefined || tokenId === NATIVE_TOKEN_ID,
    tokenId,
  });

  const {
    isLoading: isUsdPriceLoading,
    data: oneTokenUsdPrice,
    error: usdPriceError,
  } = useTokenUsdPrice({ disabled: !isValidFtContractAccountId, tokenId });

  return useMemo(() => {
    const error = !isValidFtContractAccountId
      ? new Error(`Token ID ${tokenId} is invalid.`)
      : (ntMetadataError ??
        accountSummaryError ??
        ftMetadataError ??
        ftBalanceError ??
        usdPriceError);

    const status = {
      isLoading: isNtMetadataLoading || isFtMetadataLoading,
      isUsdPriceLoading,
      isBalanceLoading: isAccountSummaryLoading || isFtBalanceLoading,
      error,
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
              usdPrice: oneTokenUsdPrice ? Big(oneTokenUsdPrice) : undefined,

              balance: ftBalance
                ? stringifiedU128ToBigNum(ftBalance, ftMetadata.decimals)
                : undefined,

              balanceFloat: ftBalance
                ? stringifiedU128ToFloat(ftBalance, ftMetadata.decimals)
                : undefined,

              balanceUsd:
                ftBalance && oneTokenUsdPrice ? Big(ftBalance).mul(oneTokenUsdPrice) : undefined,
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
    isAccountSummaryLoading,
    isFtBalanceLoading,
    isFtMetadataLoading,
    isNtMetadataLoading,
    isUsdPriceLoading,
    isValidFtContractAccountId,
    ntMetadata,
    ntMetadataError,
    oneTokenUsdPrice,
    tokenId,
    usdPriceError,
  ]);
};

/**
 * @deprecated Use `usdPrice` Big number from `tokenHooks.useSupportedToken({ tokenId: ... })`
 */
export const useTokenUsdDisplayValue = ({
  amountFloat,
  tokenId,
}: ByTokenId & {
  amountFloat: number;
}): string | null => {
  const { data: token } = useSupportedToken({ tokenId });

  const value = token ? parseFloat(token.usdPrice?.mul(amountFloat).toFixed(2) ?? "0") : 0;

  return useMemo(() => (isNaN(value) ? null : `~$ ${formatWithCommas(value.toString())}`), [value]);
};
