import { useMemo } from "react";

import { coingecko } from "@/common/api/coingecko";
import { NEAR_DEFAULT_TOKEN_DECIMALS } from "@/common/constants";
import { bigNumToFloat } from "@/common/lib";
import formatWithCommas from "@/common/lib/formatWithCommas";

export const useYoctoNearUsdDisplayValue = (
  amountYoctoNear: string,
): string => {
  const { data: oneNearUsdPrice } = coingecko.useOneNearUsdPrice();

  return useMemo(
    () =>
      `~$ ${formatWithCommas(
        (oneNearUsdPrice
          ? bigNumToFloat(amountYoctoNear, NEAR_DEFAULT_TOKEN_DECIMALS) *
            oneNearUsdPrice
          : 0.0
        ).toString(),
      )}`,

    [amountYoctoNear, oneNearUsdPrice],
  );
};
