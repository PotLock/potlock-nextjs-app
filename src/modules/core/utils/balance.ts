import { Big } from "big.js";

import { bigStringToFloat, formatWithCommas } from "@/common/lib";
import { FungibleTokenMetadata } from "@/common/types";
import { store } from "@/store";

export const balanceToString = ({
  amount,
  metadata,
}: {
  amount: string;
  metadata: FungibleTokenMetadata;
}) => `${bigStringToFloat(amount, metadata.decimals)} ${metadata.symbol}`;

export const oneNearUsdPrice = () => store.getState().core.oneNearUsdPrice;

export const nearToUsdWithFallback = (
  amountNear: number,
  abbreviate?: boolean,
) => {
  const nearToUsdInfo = oneNearUsdPrice();

  return nearToUsdInfo
    ? "~$" + formatWithCommas((amountNear * nearToUsdInfo).toFixed(2))
    : formatWithCommas(amountNear.toString()) + (abbreviate ? "N" : " NEAR");
};

export const yoctosToUsdWithFallback = (
  amountYoctoNear: string,
  abbreviate?: boolean,
) => {
  const nearToUsdInfo = oneNearUsdPrice();

  return nearToUsdInfo
    ? "~$" +
        formatWithCommas(
          Big(amountYoctoNear).mul(nearToUsdInfo).div(1e24).toFixed(2),
        )
    : formatWithCommas(Big(amountYoctoNear).div(1e24).toFixed(2)) +
        (abbreviate ? "N" : " NEAR");
};
