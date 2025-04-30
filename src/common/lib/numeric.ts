import { Big, BigSource } from "big.js";
import { number, preprocess } from "zod";

export const basisPointsToPercents = (basisPoints: number, totalBasisPoints: number) =>
  basisPoints / (totalBasisPoints / 100);

export const percentsToBasisPoints = (percentage: number, totalBasisPoints: number) =>
  percentage * (totalBasisPoints / 100);

export type NumericComparatorKey = keyof Big.Big & ("lt" | "lte" | "gt" | "gte");

export const NUMERIC_COMPARATOR_KEYS: NumericComparatorKey[] = ["lt", "lte", "gt", "gte"];

const normalizeCommaSeparatedFloatString = (input: string): string => {
  const hasComma = input.includes(",");
  const hasDot = input.includes(".");

  //* Both comma and dot present - replace dots with empty string and first comma with dot
  if (hasComma && hasDot) {
    return input.replace(/\./g, "").replace(",", ".");
  }
  //* Only comma present - replace comma with dot
  else if (hasComma) {
    return input.replace(",", ".");
  }
  //* No comma or only dots - return as is
  else return input;
};

/**
 * Detects the decimal separator defined by the user agent locale
 */
export const getDecimalSeparator = () =>
  Intl.NumberFormat(navigator.language ?? "en")
    .formatToParts(123_456.789)
    .find((part) => part.type === "decimal")?.value ?? ".";

/**
 * Converts a numeric string value into Big.js BigNum instance,
 * taking user agent locale into consideration for decimal separators.
 * In cases where the input type may fluctuate in runtime between `string` and `number`,
 * fallbacks to direct use of the Big.js constructor.
 */
export const parseBig = (input: string | number): Big => {
  if (typeof input === "string") {
    const safeInput = input || "0";
    const decimalSeparator = getDecimalSeparator();
    const isCommaDecimalSeparator = decimalSeparator === ",";

    const normalizedInput = isCommaDecimalSeparator
      ? normalizeCommaSeparatedFloatString(safeInput)
      : safeInput;

    try {
      return new Big(normalizedInput);
    } catch (error) {
      console.error(`Unable to process ${input} as number.`);

      return new Big(0);
    }
  } else {
    return new Big(input ?? 0);
  }
};

/**
 * A locale-aware alternative to {@link parseFloat}.
 * Uses {@link parseBig} to handle locale-specific formatting
 * and mitigate floating point precision loss.
 *
 * Also handles cases where the input type may fluctuate in runtime between `string` and `number`.
 */
export const parseNumber = (input: string | number): number => parseBig(input).toNumber();

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
  (value) => parseNumber(value as string),

  number({ message: "Must be a positive number." })
    .positive("Must be a positive number.")
    .finite()
    .safe()
    .transform((floatOrInt) => number().safeParse(floatOrInt).data ?? 0),
);

/**
 * An integer percentage between 0 and 100
 */
export const integerCappedPercentage = preprocess(
  (value) => (typeof value === "string" ? safePositiveNumber.parse(value) : value),
  safePositiveNumber,
)
  .refine((percents) => percents < 100, { message: "Must be less than 100%." })
  .refine((percents) => Number.isInteger(percents), {
    message: "Fractional percentage is not supported.",
  });

export const deriveShare = (amount: number, numOfShares: number) =>
  parseFloat(
    parseBig(amount)
      .div(numOfShares > 0 ? numOfShares : 1)
      .toFixed(4, 0),
  );
