import { Big } from "big.js";

import { formatWithCommas } from "@/common/lib";
import { store } from "@/store";

/**
 * @deprecated Used to be a badly designed temporary solution. Use specific formatters in-place instead.
 */
export const yoctosToUsdWithFallback = (
  amountYoctoNear: string,
  abbreviate?: boolean,
) => {
  const nearToUsdInfo = store.getState().core.oneNearUsdPrice;

  return nearToUsdInfo
    ? "~$" +
        formatWithCommas(
          Big(amountYoctoNear).mul(nearToUsdInfo).div(1e24).toFixed(2),
        )
    : formatWithCommas(Big(amountYoctoNear).div(1e24).toFixed(2)) +
        (abbreviate ? "N" : " NEAR");
};
