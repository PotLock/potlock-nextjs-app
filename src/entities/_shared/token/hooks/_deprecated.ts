import { Big } from "big.js";

import { coingeckoHooks } from "@/common/api/coingecko";
import { formatWithCommas } from "@/common/lib";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useFungibleToken } from "@/entities/_shared/token";

/**
 * @deprecated Use `data.usdPrice` from {@link useFungibleToken}({ tokenId: NATIVE_TOKEN_ID })
 */
export const useNearToUsdWithFallback = (amountNear: number, abbreviate?: boolean) => {
  const { data: oneNearTokenUsdPrice } = coingeckoHooks.useNativeTokenUsdPrice();

  return oneNearTokenUsdPrice
    ? "~$" + formatWithCommas(Big(oneNearTokenUsdPrice).mul(amountNear).toFixed(2))
    : formatWithCommas(amountNear.toString()) + (abbreviate ? "N" : " NEAR");
};
