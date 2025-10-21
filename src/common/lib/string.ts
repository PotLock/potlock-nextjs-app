export type EmptyString = `${""}`;

export const EMPTY_STRING: EmptyString = "";

export const truncate = (value: string, maxLength: number) => {
  if ((value?.length ?? 0) <= maxLength) {
    return value;
  } else {
    return value.substring(0, maxLength - 3) + "...";
  }
};

/**
 * Truncates HTML content by first stripping HTML tags, then truncating the plain text
 * @param htmlContent - HTML string to truncate
 * @param maxLength - Maximum length of the plain text
 * @returns Truncated plain text with ellipsis
 */
export const truncateHtml = (htmlContent: string, maxLength: number): string => {
  if (!htmlContent) return "";

  // Create a temporary div to parse HTML and get text content
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  const textContent = tempDiv.textContent || "";

  // Use the regular truncate function on the plain text
  return truncate(textContent, maxLength);
};

export const isValidHttpUrl = (value: string) => {
  try {
    return Boolean(new URL(value));
  } catch (_) {
    return false;
  }
};

export const utf8StringToBase64 = (value: string): string => {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(value);
  const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), "");

  return btoa(binary);
};
