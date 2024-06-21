import { useMemo } from "react";

import { coingecko } from "@/common/api/coingecko";
import formatWithCommas from "@/common/lib/formatWithCommas";

export const useNearUsdDisplayValue = (amountNearFloat: number): string => {
  const { data: oneNearUsdPrice } = coingecko.useOneNearUsdPrice();

  return useMemo(
    () =>
      `~$ ${formatWithCommas(
        (oneNearUsdPrice ? amountNearFloat * oneNearUsdPrice : 0.0).toString(),
      )}`,

    [amountNearFloat, oneNearUsdPrice],
  );
};
