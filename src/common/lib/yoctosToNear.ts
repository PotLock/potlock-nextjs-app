import Big from "big.js";

import formatWithCommas from "./formatWithCommas";

export const yoctosToNear = (amountYoctos: string, abbreviate?: boolean) => {
  return (
    formatWithCommas(Big(amountYoctos).div(1e24).toFixed(2)) +
    (abbreviate ? "N" : " NEAR")
  );
};
