import { Big, BigSource } from "big.js";
import { number, preprocess } from "zod";

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

export const intoShareValue = (amount: number, numOfShares: number) =>
  parseFloat(((amount ?? 0) / (numOfShares > 0 ? numOfShares : 1)).toFixed(4));
