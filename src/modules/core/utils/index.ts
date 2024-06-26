import { store } from "@/app/_store";
import { NearBalanceResponse } from "@/common/api/pagoda";
import { bigStringToFloat, formatWithCommas } from "@/common/lib";

export const balanceToString = ({
  amount,
  metadata,
}: NearBalanceResponse["balance"]) =>
  `${bigStringToFloat(amount, metadata.decimals)} ${metadata.symbol}`;

export const nearToUsd = () => store.getState().core.nearToUsd;

export const nearToUsdWithFallback = (
  amountNear: number,
  abbreviate?: boolean,
) => {
  const nearToUsdInfo = nearToUsd();

  return nearToUsdInfo
    ? "~$" + formatWithCommas((amountNear * nearToUsdInfo).toFixed(2))
    : formatWithCommas(amountNear.toString()) + (abbreviate ? "N" : " NEAR");
};
