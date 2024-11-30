import { Big } from "big.js";

import { NATIVE_TOKEN_DECIMALS } from "../constants";
import { U128String } from "../types";

export const u128StringToBigNum = (amount: U128String, decimals: number) =>
  Big(amount).div(Big(10).pow(decimals));

export const u128StringToFloat = (amount: U128String, decimals: number) =>
  parseFloat(u128StringToBigNum(amount, decimals).toFixed(2));

export const floatToBigNum = (amount: number, decimals: number) =>
  Big(amount).mul(Big(10).pow(decimals));

export const yoctoNearToFloat = (amountYoctoNear: U128String) =>
  u128StringToFloat(amountYoctoNear, NATIVE_TOKEN_DECIMALS);

export const floatToYoctoNear = (amountFloat: number): U128String =>
  floatToBigNum(amountFloat, NATIVE_TOKEN_DECIMALS).toFixed().toString();
