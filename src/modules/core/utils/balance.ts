import Big from "big.js";

import { NearBalanceResponse } from "@/common/api/pagoda";
import { bigStringToFloat, formatWithCommas } from "@/common/lib";
import { store } from "@/store";

export const balanceToString = ({
  amount,
  metadata,
}: NearBalanceResponse["balance"]) =>
  `${bigStringToFloat(amount, metadata.decimals)} ${metadata.symbol}`;

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
  amountYoctos: string,
  abbreviate?: boolean,
) => {
  const nearToUsdInfo = oneNearUsdPrice();

  return nearToUsdInfo
    ? "~$" +
        formatWithCommas(
          Big(amountYoctos).mul(nearToUsdInfo).div(1e24).toFixed(2),
        )
    : formatWithCommas(Big(amountYoctos).div(1e24).toFixed(2)) +
        (abbreviate ? "N" : " NEAR");
};
