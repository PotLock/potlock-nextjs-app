import { useMemo } from "react";

import { coingecko } from "@/common/api/coingecko";
import formatWithCommas from "@/common/lib/formatWithCommas";

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
