import { Big, BigSource } from "big.js";
import { number, preprocess } from "zod";

export type NumericComparatorKey = keyof Big.Big & ("lt" | "lte" | "gt" | "gte");

export const NUMERIC_COMPARATOR_KEYS: NumericComparatorKey[] = ["lt", "lte", "gt", "gte"];

/**
 * Detects the decimal separator defined by the user agent locale
 */
const getDecimalSeparator = () =>
  Intl.NumberFormat(navigator.language ?? "en")
    .formatToParts(123_456.79)
    .find((part) => part.type === "decimal")?.value ?? ".";

/**
 * Converts a numeric string value into Big.js BigNum instance,
 *  taking user agent locale into consideration,
 *  as different locales use different decimal separators
 */
export const parseBig = (input: string): Big => {
  const runtimeSafeInput = (input as string | undefined) || "0";
  const decimalSeparator = getDecimalSeparator();
  const isCommaDecimalSeparator = decimalSeparator === ",";

  const normalizedInput = isCommaDecimalSeparator
    ? runtimeSafeInput.replace(/\./g, "").replace(",", ".")
    : runtimeSafeInput;

  return new Big(normalizedInput);
};

export const isBigSource = (value: unknown | BigSource) => {
  try {
    /** Attempt to create a new Big instance */
    new Big(value as BigSource);

    /** If successful, it's a valid BigSource */
    return true;
  } catch (_error) {
    /** If an error is thrown, it's not a valid BigSource */
    return false;
  }
};

export const safePositiveNumber = preprocess(
  (value) => parseFloat(value as string),

  number({ message: "Must be a positive number." })
    .positive("Must be a positive number.")
    .finite()
    .safe()
    .transform((floatOrInt) => number().safeParse(floatOrInt).data ?? 0),
);

export const deriveShare = (amount: number, numOfShares: number) =>
  parseFloat(
    Big(amount ?? 0)
      .div(numOfShares > 0 ? numOfShares : 1)
      .toFixed(4, 0),
  );
