import { useMemo } from "react";

import { pick } from "remeda";
import { useShallow } from "zustand/shallow";

import { coingecko } from "@/common/api/coingecko";
import formatWithCommas from "@/common/lib/formatWithCommas";
import { FungibleTokenMetadata } from "@/common/types";

import { useFtRegistryStore } from "./models";

export const useSupportedTokens = () => {
  const { data, error } = useFtRegistryStore(
    useShallow(pick(["data", "error"])),
  );

  const isLoading = useMemo(
    () => data === undefined && error === undefined,
    [data, error],
  );

  return { isLoading, data, error };
};

export const useTokenUsdDisplayValue = ({
  amountFloat,
  symbol,
}: Pick<FungibleTokenMetadata, "symbol"> & {
  amountFloat: number;
}): string | null => {
  const { data: oneNearUsdPrice } = coingecko.useTokenUsdPrice({ symbol });
  const value = oneNearUsdPrice ? amountFloat * oneNearUsdPrice : 0.0;

  return useMemo(
    () => (isNaN(value) ? null : `~$ ${formatWithCommas(value.toString())}`),
    [value],
  );
};

export const useNearUsdDisplayValue = (
  amountNearFloat: number,
): string | null => {
  const { data: oneNearUsdPrice } = coingecko.useOneNearUsdPrice();
  const value = oneNearUsdPrice ? amountNearFloat * oneNearUsdPrice : 0.0;

  return useMemo(
    () => (isNaN(value) ? null : `~$ ${formatWithCommas(value.toString())}`),
    [value],
  );
};
