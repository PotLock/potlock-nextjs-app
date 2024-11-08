import Big from "big.js";

import formatWithCommas from "./formatWithCommas";
import { NATIVE_TOKEN_DECIMALS } from "../constants";

/**
 * @deprecated Use `yoctoNearToFloat`
 */
export const yoctosToNear = (amountYoctoNear: string, abbreviate?: boolean) => {
  return (
    formatWithCommas(Big(amountYoctoNear).div(1e24).toFixed(2)) +
    (abbreviate ? "N" : " NEAR")
  );
};

export const bigNumFromString = (amount: string, decimals: number) =>
  Big(amount).div(Big(10).pow(decimals));

export const bigStringToFloat = (amount: string, decimals: number) =>
  parseFloat(bigNumFromString(amount, decimals).toFixed(2));

export const floatToBigNum = (amount: number, decimals: number) =>
  Big(amount).mul(Big(10).pow(decimals));

export const yoctoNearToFloat = (amountYoctoNear: string) =>
  bigStringToFloat(amountYoctoNear, NATIVE_TOKEN_DECIMALS);

export const floatToYoctoNear = (amountFloat: number) =>
  floatToBigNum(amountFloat, NATIVE_TOKEN_DECIMALS).toFixed().toString();
