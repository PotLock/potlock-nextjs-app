import { useEffect, useMemo } from "react";

import { Big } from "big.js";
import { pick } from "remeda";
import { useShallow } from "zustand/shallow";

import { coingecko } from "@/common/api/coingecko";
import { intearPricesHooks } from "@/common/api/intear-prices";
import { NATIVE_TOKEN_ID, PLATFORM_LISTED_TOKEN_ACCOUNT_IDS } from "@/common/constants";
import { refExchangeHooks } from "@/common/contracts/ref-finance";
import { ftHooks } from "@/common/contracts/tokens";
import { isAccountId, stringifiedU128ToBigNum, stringifiedU128ToFloat } from "@/common/lib";
import { formatWithCommas } from "@/common/lib/formatWithCommas";
import type { AccountId, ByTokenId, WithDisabled } from "@/common/types";

import { type FtData, useFtRegistryStore } from "./models";

/**
 * Registry of supported fungible tokens.
 */
export const useTokenRegistry = () => {
  const { data, error } = useFtRegistryStore(useShallow(pick(["data", "error"])));

  const isLoading = useMemo(() => data === undefined && error === undefined, [data, error]);

  useEffect(() => void (error ? console.error(error) : null), [error]);

  return { isLoading, data, error };
};

export const useTokenPrice = ({ tokenId, disabled = false }: ByTokenId & WithDisabled) => {
  const {
    isLoading: isNativeTokenPriceLoading,
    data: oneNativeTokenPrice,
    error: nativeTokenPriceError,
  } = coingecko.useTokenUsdPrice({
    tokenId,
    disabled: disabled || tokenId !== NATIVE_TOKEN_ID,
  });

  const {
    isLoading: isFungibleTokenPriceLoading,
    data: oneFungibleTokenUsdPrice,
    error: fungibleTokenPriceError,
  } = intearPricesHooks.useTokenUsdPrice({
    tokenId,
    disabled: disabled || tokenId === NATIVE_TOKEN_ID,
  });

  return {
    isLoading: isNativeTokenPriceLoading || isFungibleTokenPriceLoading,
    data: oneFungibleTokenUsdPrice || oneNativeTokenPrice,
    error: fungibleTokenPriceError || nativeTokenPriceError,
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
  const { data: refFinanceListedTokenAccountIds } = refExchangeHooks.useWhitelistedTokens();

  const isTokenSupported =
    tokenId === NATIVE_TOKEN_ID ||
    (isAccountId(tokenId) &&
      (refFinanceListedTokenAccountIds?.includes(tokenId) ||
        PLATFORM_LISTED_TOKEN_ACCOUNT_IDS.includes(tokenId)));

  const {
    isLoading: isMetadataLoading,
    data: metadata,
    error: metadataError,
  } = ftHooks.useFtMetadata({
    disabled: !isTokenSupported,
    tokenId,
  });

  const {
    isLoading: isUsdPriceLoading,
    data: oneTokenUsdPrice,
    error: usdPriceError,
  } = useTokenPrice({
    disabled: !isTokenSupported,
    tokenId,
  });

  console.log(tokenId, isUsdPriceLoading, oneTokenUsdPrice, usdPriceError);

  const error = useMemo(
    () =>
      !isTokenSupported
        ? new Error(`Fungible or Native token ${tokenId} is not supported on this platform.`)
        : (metadataError ?? usdPriceError),

    [isTokenSupported, metadataError, tokenId, usdPriceError],
  );

  const { isLoading: isBalanceLoading, data: balance } = ftHooks.useFtBalanceOf({
    accountId: balanceCheckAccountId ?? "noop",
    disabled: balanceCheckAccountId === undefined,
    tokenId,
  });

  useEffect(() => void (error ? console.error(error) : null), [error]);

  // TODO: Implement balance and price retrieval
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
  const { data: oneTokenUsdPrice } = coingecko.useTokenUsdPrice({ tokenId });
  const value = oneTokenUsdPrice ? amountFloat * oneTokenUsdPrice : 0.0;

  return useMemo(() => (isNaN(value) ? null : `~$ ${formatWithCommas(value.toString())}`), [value]);
};
