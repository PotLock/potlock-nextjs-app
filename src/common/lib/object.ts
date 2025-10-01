import { mapValues } from "remeda";

import { utf8StringToBase64 } from "./string";

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
    }
  : T;

// TODO: Find a way to resolve `any` without sacrificing type safety
export const deepObjectDiff = <T extends Record<string, any>>(
  objOriginal: T,
  objUpdated: T,
): DeepPartial<T> => {
  if (!objUpdated) objUpdated = {} as T;
  const diff = {} as DeepPartial<T>;

  function findDiff<U extends Record<string, any>>(
    original: U | undefined,
    updated: U,
    diffObj: DeepPartial<U>,
  ): DeepPartial<U> {
    Object.keys(updated).forEach((key: string) => {
      const updatedValue = updated[key];
      const originalValue = original ? original[key] : undefined;

      // If both values are objects, recurse.
      if (
        typeof updatedValue === "object" &&
        updatedValue !== null &&
        (originalValue === undefined ||
          (typeof originalValue === "object" && originalValue !== null))
      ) {
        const nestedDiff = originalValue ? findDiff(originalValue, updatedValue, {}) : updatedValue;

        if (Object.keys(nestedDiff).length > 0) {
          (diffObj as Record<string, unknown>)[key] = nestedDiff;
        }
      } else if (updatedValue !== originalValue) {
        // Direct comparison for string values.
        (diffObj as Record<string, unknown>)[key] = updatedValue;
      }
    });

    return diffObj;
  }

  return findDiff(objOriginal, objUpdated, diff);
};

export const nullifyEmptyStrings = mapValues((value: string | unknown) => {
  if (typeof value === "string" && value.length === 0) {
    return null;
  } else return value;
});

export const objectToBase64Json = (obj: object | Record<string, unknown>): string =>
  utf8StringToBase64(JSON.stringify(obj));
