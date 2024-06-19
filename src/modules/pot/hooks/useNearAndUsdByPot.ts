import { useEffect, useState } from "react";

import { Pot } from "@/common/api/potlock/generated";
import { yoctosToNear, yoctosToUsdWithFallback } from "@/common/lib";

const useNearAndUsdByPot = ({ pot }: { pot?: Pot }) => {
  const [amountNear, setAmountNear] = useState(
    pot ? yoctosToNear(pot.matching_pool_balance, true) : undefined,
  );
  const [amountUsd, setAmountUsd] = useState("-");

  useEffect(() => {
    if (pot) {
      yoctosToUsdWithFallback(pot.matching_pool_balance).then((usdInfo) => {
        setAmountUsd(usdInfo);
      });

      setAmountNear(yoctosToNear(pot.matching_pool_balance, true));
    }
  }, [pot]);

  return {
    amountNear,
    amountUsd,
  };
};

export default useNearAndUsdByPot;
