import { Big } from "big.js";

import { formatWithCommas } from "@/common/lib";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { tokenHooks } from "@/common/services/token";

/**
 * @deprecated Use `usdPrice` from {@link tokenHooks.useSupportedToken}({ tokenId: NATIVE_TOKEN_ID })
 */
export const useNearToUsdWithFallback = (amountNear: number, abbreviate?: boolean) => {
  const { data: oneNearTokenUsdPrice } = tokenHooks.useTokenUsdPrice({ tokenId: "near" });

  return oneNearTokenUsdPrice
    ? "~$" + formatWithCommas(Big(oneNearTokenUsdPrice).mul(amountNear).toFixed(2))
    : formatWithCommas(amountNear.toString()) + (abbreviate ? "N" : " NEAR");
};
