import { coingecko } from "@/common/api/coingecko";
import { formatWithCommas } from "@/common/lib";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ftService } from "@/common/services";

/**
 * @deprecated Use `usdPrice` from {@link ftService.useRegisteredToken}({ tokenId: NATIVE_TOKEN_ID })
 */
export const useNearToUsdWithFallback = (amountNear: number, abbreviate?: boolean) => {
  const { data: oneNearUsdPrice } = coingecko.useOneNearUsdPrice();

  return oneNearUsdPrice
    ? "~$" + formatWithCommas((amountNear * oneNearUsdPrice).toFixed(2))
    : formatWithCommas(amountNear.toString()) + (abbreviate ? "N" : " NEAR");
};
