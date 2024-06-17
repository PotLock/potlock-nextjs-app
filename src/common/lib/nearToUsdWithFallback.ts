import formatWithCommas from "./formatWithCommas";
import nearToUsd from "./nearToUsd";

const nearToUsdWithFallback = async (
  amountNear: number,
  abbreviate?: boolean,
) => {
  const nearToUsdInfo = await nearToUsd();

  return nearToUsdInfo
    ? "~$" + formatWithCommas((amountNear * nearToUsdInfo).toFixed(2))
    : formatWithCommas(amountNear.toString()) + (abbreviate ? "N" : " NEAR");
};

export default nearToUsdWithFallback;
