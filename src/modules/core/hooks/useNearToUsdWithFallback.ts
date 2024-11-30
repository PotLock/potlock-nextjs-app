import { coingecko } from "@/common/api/coingecko";
import { formatWithCommas } from "@/common/lib";
import { ftService as _ftServiceDocReference } from "@/common/services";

/**
 * @deprecated use {@link ftService.useRegisteredToken({tokenId:"NEAR"})}
 */
export const useNearToUsdWithFallback = (amountNear: number, abbreviate?: boolean) => {
  const { data: oneNearUsdPrice } = coingecko.useOneNearUsdPrice();

  return oneNearUsdPrice
    ? "~$" + formatWithCommas((amountNear * oneNearUsdPrice).toFixed(2))
    : formatWithCommas(amountNear.toString()) + (abbreviate ? "N" : " NEAR");
};
