export const truncate = (value: string, maxLength: number) => {
  if (value?.length ?? 0 <= maxLength) {
    return value;
  } else {
    return value.substring(0, maxLength - 3) + "...";
  }
};

export const isValidHttpUrl = (value: string) => {
  try {
    return Boolean(new URL(value));
  } catch (_) {
    return false;
  }
};
