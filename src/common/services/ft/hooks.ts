import { useEffect, useMemo } from "react";

import { pick } from "remeda";
import { useShallow } from "zustand/shallow";

import { coingecko } from "@/common/api/coingecko";
import { formatWithCommas } from "@/common/lib/formatWithCommas";
import { ByTokenId } from "@/common/types";

import { useFtRegistryStore } from "./model";

/**
 * Registry of supported fungible tokens.
 */
export const useTokenRegistry = () => {
  const { data, error } = useFtRegistryStore(useShallow(pick(["data", "error"])));

  const isLoading = useMemo(() => data === undefined && error === undefined, [data, error]);

  useEffect(() => void (error ? console.error(error) : null), [error]);

  return { isLoading, data, error };
};

/**
 * Fungible token data for a supported token.
 */
export const useRegisteredToken = ({ tokenId }: ByTokenId) => {
  const { isLoading, data: tokenRegistry } = useTokenRegistry();

  const token = useMemo(() => tokenRegistry?.[tokenId], [tokenRegistry, tokenId]);

  const error = useMemo(
    () =>
      !isLoading && token === null
        ? new Error(`Fungible token ${tokenId} is not supported on this platform.`)
        : undefined,

    [isLoading, token, tokenId],
  );

  useEffect(() => void (error ? console.error(error) : null), [error]);

  return {
    data: token,
    error,
  };
};

/**
 * @deprecated Use `usdPrice` Big number from `ftService.useRegisteredToken({ tokenId: ... })`
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
