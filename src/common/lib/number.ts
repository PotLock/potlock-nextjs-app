import { number, preprocess } from "zod";

export const safePositiveNumber = preprocess(
  (value) => parseFloat(value as string),

  number({ message: "Must be a positive number." })
    .positive("Must be a positive number.")
    .finite()
    .safe()
    .transform((floatOrInt) => number().safeParse(floatOrInt).data ?? 0),
);
