import { useEffect, useMemo } from "react";

import { pick } from "remeda";
import { useShallow } from "zustand/shallow";

import { coingecko } from "@/common/api/coingecko";
import { formatWithCommas } from "@/common/lib/formatWithCommas";
import { ByTokenId } from "@/common/types";

import { useFtRegistryStore } from "./models";

export const useTokenRegistry = () => {
  const { data, error } = useFtRegistryStore(
    useShallow(pick(["data", "error"])),
  );

  const isLoading = useMemo(
    () => data === undefined && error === undefined,
    [data, error],
  );

  useEffect(() => void (error ? console.error(error) : null), [error]);

  return { isLoading, data, error };
};

export const useRegisteredToken = ({ tokenId }: ByTokenId) => {
  const { metadata, balance, balanceFloat } = useFtRegistryStore(
    useShallow(
      (registry) =>
        registry.data?.[tokenId] ?? {
          metadata: null,
          balance: null,
          balanceFloat: null,
        },
    ),
  );

  const error = useMemo(
    () =>
      metadata === null
        ? new Error(
            `Unable to get token metadata for "${tokenId}" or it's not supported on this platform.`,
          )
        : undefined,

    [metadata, tokenId],
  );

  useEffect(() => void (error ? console.error(error) : null), [error]);

  return {
    data: metadata ? { metadata, balance, balanceFloat } : undefined,
    error,
  };
};

export const useTokenUsdDisplayValue = ({
  amountFloat,
  tokenId,
}: ByTokenId & {
  amountFloat: number;
}): string | null => {
  const { data: oneTokenUsdPrice } = coingecko.useTokenUsdPrice({ tokenId });
  const value = oneTokenUsdPrice ? amountFloat * oneTokenUsdPrice : 0.0;

  return useMemo(
    () => (isNaN(value) ? null : `~$ ${formatWithCommas(value.toString())}`),
    [value],
  );
};
