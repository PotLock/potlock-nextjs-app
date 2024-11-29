import { useEffect, useState } from "react";

import { Big } from "big.js";
import { pipe } from "remeda";

import { Pot } from "@/common/api/indexer";
import { formatWithCommas } from "@/common/lib";
import { yoctosToUsdWithFallback } from "@/modules/core";

/**
 * @deprecated Use `yoctoNearToFloat`
 */
const yoctoNearToNear = (amountYoctoNear: string, abbreviate?: boolean) => {
  return formatWithCommas(Big(amountYoctoNear).div(1e24).toFixed(2)) + (abbreviate ? "N" : " NEAR");
};

/**
 * @deprecated use `ftService` capabilities.
 */
export const useNearAndUsdByPot = ({ pot }: { pot?: Pot }) => {
  const [amountNear, setAmountNear] = useState(
    pot ? yoctoNearToNear(pot.matching_pool_balance, true) : undefined,
  );
  const [amountUsd, setAmountUsd] = useState("-");

  useEffect(() => {
    if (pot) {
      pipe(pot.matching_pool_balance, yoctosToUsdWithFallback, setAmountUsd);
      setAmountNear(yoctoNearToNear(pot.matching_pool_balance, true));
    }
  }, [pot]);

  return {
    amountNear,
    amountUsd,
  };
};
