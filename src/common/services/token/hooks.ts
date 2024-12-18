import { useMemo } from "react";

import { Big } from "big.js";
import useSWR from "swr";

import { coingeckoClient } from "@/common/api/coingecko";
import { intearPricesHooks } from "@/common/api/intear-prices";
import { NATIVE_TOKEN_ID, PLATFORM_LISTED_TOKEN_IDS } from "@/common/constants";
import { refExchangeHooks } from "@/common/contracts/ref-finance";
import { ftHooks } from "@/common/contracts/tokens";
import { isAccountId, stringifiedU128ToBigNum, stringifiedU128ToFloat } from "@/common/lib";
import { formatWithCommas } from "@/common/lib/formatWithCommas";
import type { AccountId, ByTokenId, WithDisabled } from "@/common/types";

import { type FtData } from "./types";

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
  data?: FtData;
  error?: Error;
};

/**
 * Fungible token data for a supported token.
 *
 * When `balanceCheckAccountId` is provided, the balance of the token is also retrieved.
 */
export const useSupportedToken = ({
  tokenId,
  balanceCheckAccountId,
}: SupportedTokenQuery): SupportedTokenQueryResult => {
  const isValidTokenId = tokenId === NATIVE_TOKEN_ID || isAccountId(tokenId);

  const {
    isLoading: isMetadataLoading,
    data: metadata,
    error: metadataError,
  } = ftHooks.useFtMetadata({
    disabled: !isValidTokenId,
    tokenId,
  });

  const {
    isLoading: isUsdPriceLoading,
    data: oneTokenUsdPrice,
    error: usdPriceError,
  } = useTokenUsdPrice({
    disabled: !isValidTokenId,
    tokenId,
  });

  const error = useMemo(
    () =>
      !isValidTokenId
        ? new Error(`Token ID ${tokenId} is invalid.`)
        : (metadataError ?? usdPriceError),

    [isValidTokenId, metadataError, tokenId, usdPriceError],
  );

  const { isLoading: isBalanceLoading, data: balance } = ftHooks.useFtBalanceOf({
    accountId: balanceCheckAccountId ?? "noop",
    disabled: balanceCheckAccountId === undefined,
    tokenId,
  });

  return useMemo(() => {
    return {
      isLoading: isMetadataLoading,
      isUsdPriceLoading,
      isBalanceLoading,

      data: metadata
        ? {
            tokenId,
            metadata,
            usdPrice: oneTokenUsdPrice ? Big(oneTokenUsdPrice) : undefined,
            balance: balance ? stringifiedU128ToBigNum(balance, metadata.decimals) : undefined,
            balanceFloat: balance ? stringifiedU128ToFloat(balance, metadata.decimals) : undefined,

            balanceUsd:
              balance && oneTokenUsdPrice ? Big(balance).mul(oneTokenUsdPrice) : undefined,
          }
        : undefined,

      error,
    };
  }, [
    balance,
    error,
    isBalanceLoading,
    isMetadataLoading,
    isUsdPriceLoading,
    metadata,
    oneTokenUsdPrice,
    tokenId,
  ]);
};

/**
 * @deprecated Use `usdPrice` Big number from `tokenService.useSupportedToken({ tokenId: ... })`
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
