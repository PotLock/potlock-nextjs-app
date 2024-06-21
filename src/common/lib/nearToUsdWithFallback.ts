import formatWithCommas from "./formatWithCommas";
import nearToUsd from "./nearToUsd";

const nearToUsdWithFallback = (amountNear: number, abbreviate?: boolean) => {
  const nearToUsdInfo = nearToUsd();

  return nearToUsdInfo
    ? "~$" + formatWithCommas((amountNear * nearToUsdInfo).toFixed(2))
    : formatWithCommas(amountNear.toString()) + (abbreviate ? "N" : " NEAR");
};

export default nearToUsdWithFallback;
