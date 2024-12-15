import { Big } from "big.js";
import { formatNearAmount, parseNearAmount } from "near-api-js/lib/utils/format";

import { NATIVE_TOKEN_DECIMALS } from "../constants";
import { U128String } from "../types";

export { formatNearAmount, parseNearAmount };

export const stringifiedU128ToBigNum = (amount: U128String, decimals: number) =>
  Big(amount).div(Big(10).pow(decimals));

export const stringifiedU128ToFloat = (amount: U128String, decimals: number) =>
  parseFloat(stringifiedU128ToBigNum(amount, decimals).toFixed(2));

export const floatToBigNum = (amount: number, decimals: number) =>
  Big(amount).mul(Big(10).pow(decimals));

/**
 * @deprecated use {@link formatNearAmount}
 */
export const yoctoNearToFloat = (amountYoctoNear: U128String) =>
  stringifiedU128ToFloat(amountYoctoNear, NATIVE_TOKEN_DECIMALS);

/**
 * @deprecated use {@link parseNearAmount}
 */
export const floatToYoctoNear = (amountFloat: number): U128String =>
  floatToBigNum(amountFloat, NATIVE_TOKEN_DECIMALS).toFixed().toString();
