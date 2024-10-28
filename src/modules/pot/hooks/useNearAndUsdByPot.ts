import { useEffect, useState } from "react";

import { pipe } from "remeda";

import { Pot } from "@/common/api/indexer";
import { yoctosToNear } from "@/common/lib";
import { yoctosToUsdWithFallback } from "@/modules/core";

const useNearAndUsdByPot = ({ pot }: { pot?: Pot }) => {
  const [amountNear, setAmountNear] = useState(
    pot ? yoctosToNear(pot.matching_pool_balance, true) : undefined,
  );
  const [amountUsd, setAmountUsd] = useState("-");

  useEffect(() => {
    if (pot) {
      pipe(pot.matching_pool_balance, yoctosToUsdWithFallback, setAmountUsd);
      setAmountNear(yoctosToNear(pot.matching_pool_balance, true));
    }
  }, [pot]);

  return {
    amountNear,
    amountUsd,
  };
};

export default useNearAndUsdByPot;
