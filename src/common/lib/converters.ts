import Big from "big.js";

import formatWithCommas from "./formatWithCommas";
import { NEAR_DEFAULT_TOKEN_DECIMALS } from "../constants";

export const yoctosToNear = (amountYoctos: string, abbreviate?: boolean) => {
  return (
    formatWithCommas(Big(amountYoctos).div(1e24).toFixed(2)) +
    (abbreviate ? "N" : " NEAR")
  );
};

export const bigNumToFloat = (amount: string, decimals: number) => {
  const decimalMultiplier = Big(10).pow(decimals);
  return parseFloat(Big(amount).div(decimalMultiplier).toFixed(2));
};

export const floatToBigNum = (amount: number, decimals: number) => {
  const decimalMultiplier = Big(10).pow(decimals);
  return Big(amount).mul(decimalMultiplier);
};

export const yoctoNearToFloat = (amountYoctoNear: string) =>
  bigNumToFloat(amountYoctoNear, NEAR_DEFAULT_TOKEN_DECIMALS);

export const floatToYoctoNear = (amountFloat: number) =>
  floatToBigNum(amountFloat, NEAR_DEFAULT_TOKEN_DECIMALS).toFixed().toString();
