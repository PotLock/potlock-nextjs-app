import { Temporal } from "temporal-polyfill";
import { number, preprocess } from "zod";

export const DATETIME_INCORRECT_FORMAT_ERROR = "Incorrect datetime";

export const localeStringToTimestampMs = (value: string): number => {
  try {
    return new Date(value).getTime();
  } catch {
    const error = new TypeError(`Unable to parse \`${value}\``);

    console.error(error);
    throw error;
  }
};

export const formatDatetimeLocal = (value: string): string =>
  value.slice(0, 16);

export const millisecondsToDatetimeLocal = (value: number): string => {
  try {
    return formatDatetimeLocal(new Date(value).toISOString());
  } catch {
    const error = new TypeError(`Unable to parse \`${value}\``);

    console.error(error);
    throw error;
  }
};

export const millisecondsToLocaleString = (value: number): string => {
  try {
    return Temporal.Instant.fromEpochMilliseconds(value).toLocaleString();
  } catch {
    const error = new TypeError(`Unable to parse \`${value}\``);

    console.error(error);
    throw error;
  }
};

/**
 * Converts a value in milliseconds to the equivalent number of days.
 *
 * @param {number | string | null} value - The value to convert,
 *  which can be a number of milliseconds, a string representing a number of milliseconds, or null.
 *
 * @return {number} The number of days equivalent to the input value.
 * @throws {TypeError} If the input value cannot be converted to a number of milliseconds.
 */
export const millisecondsToDays = (value: number | string | null): number => {
  try {
    return Temporal.Duration.from({
      milliseconds: typeof value === "string" ? parseInt(value) : (value ?? 0),
    }).total("days");
  } catch {
    const error = new TypeError(`Unable to convert \`${value}\` to days`);

    console.error(error);
    throw error;
  }
};

/**
 * Converts a value in days to the equivalent number of milliseconds.
 *
 * @param {number | string | null} value - The value to convert,
 *  which can be a number of days, a string representing a number of days, or null.
 *
 * @return {number} The number of milliseconds equivalent to the input value.
 * @throws {TypeError} If the input value cannot be converted to a number of milliseconds.
 */
export const daysToMilliseconds = (value: number | string | null): number => {
  try {
    return Temporal.Duration.from({
      days: typeof value === "string" ? parseInt(value) : (value ?? 0),
    }).total("milliseconds");
  } catch {
    const error = new TypeError(
      `Unable to convert \`${value}\` to milliseconds`,
    );

    console.error(error);
    throw error;
  }
};

export const daysSinceTimestamp = (unixTimestampMs: number) =>
  Temporal.Now.instant().since(
    Temporal.Instant.fromEpochMilliseconds(unixTimestampMs),
  ).days;

export const toChronologicalOrder = <T>(
  property: keyof T,
  list: Array<
    T extends Record<string, Temporal.Instant | string | unknown> ? T : T
  >,
) =>
  list.length > 1
    ? list.sort((one, another) =>
        Temporal.Instant.compare(
          one[property] as string,
          another[property] as string,
        ),
      )
    : list;

export const timestamp = preprocess(
  (value) =>
    typeof value === "string" ? localeStringToTimestampMs(value) : value,

  number({ message: DATETIME_INCORRECT_FORMAT_ERROR })
    .int()
    .positive(DATETIME_INCORRECT_FORMAT_ERROR)
    .finite(DATETIME_INCORRECT_FORMAT_ERROR)
    .safe()
    .transform((n) => number().safeParse(n).data ?? 0),
);

export const futureTimestamp = timestamp.refine(
  (value) => value > Temporal.Now.instant().epochMilliseconds,
  { message: "Cannot be in the past" },
);
