import { number, preprocess } from "zod";

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
