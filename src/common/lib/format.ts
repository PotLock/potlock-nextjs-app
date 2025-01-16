import { Big } from "big.js";
import { formatNearAmount, parseNearAmount } from "near-api-js/lib/utils/format";

import { NATIVE_TOKEN_DECIMALS } from "../constants";
import { IndivisibleUnits } from "../types";

export { formatNearAmount, parseNearAmount };

export const indivisibleUnitsToBigNum = (amount: IndivisibleUnits, decimals: number) =>
  Big(amount).div(Big(10).pow(decimals));

// TODO: Adjust all consuming code with custom precision
export const indivisibleUnitsToFloat = (
  amount: IndivisibleUnits,
  decimals: number,
  fracDigits?: number,
) => parseFloat(indivisibleUnitsToBigNum(amount, decimals).toFixed(fracDigits ?? 2));

export const floatToIndivisible = (amountFloat: number, decimals: number) =>
  Big(amountFloat).mul(Big(10).pow(decimals)).toFixed().toString();

export const yoctoNearToFloat = (amountYoctoNear: IndivisibleUnits) =>
  indivisibleUnitsToFloat(amountYoctoNear, NATIVE_TOKEN_DECIMALS);

const floatToBigNum = (amountFloat: number, decimals: number) =>
  Big(amountFloat).mul(Big(10).pow(decimals));

export const floatToYoctoNear = (amountFloat: number): IndivisibleUnits =>
  floatToBigNum(amountFloat, NATIVE_TOKEN_DECIMALS).toFixed().toString();
