import { useMemo } from "react";

import { pick } from "remeda";
import { useShallow } from "zustand/shallow";

import { coingecko } from "@/common/api/coingecko";
import formatWithCommas from "@/common/lib/formatWithCommas";
import { ByTokenId } from "@/common/types";

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

export const useTokenMetadata = ({ tokenId }: ByTokenId) => {
  const { data, error } = useFtRegistryStore(
    useShallow(pick(["data", "error"])),
  );

  const isLoading = useMemo(
    () => data === undefined && error === undefined,
    [data, error],
  );

  const metadata = useMemo(
    () => (data ? data[tokenId].metadata : undefined),
    [data, tokenId],
  );

  return { isLoading, data: metadata, error };
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
