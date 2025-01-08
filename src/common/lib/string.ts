export const extractFromUrl = (url: string, pattern: RegExp) => {
  if (url) {
    if (url.startsWith("/")) {
      url = url.slice(1, url.length);
    }

    // Execute the regular expression on the URL
    const match = url.match(pattern);
    // If a match is found, return the extracted repository path; otherwise, return null
    return match ? match[1] : url;
  }
};

export const truncate = (input: string, maxLength: number) => {
  if (!input) return "";

  if (input.length <= maxLength) {
    return input;
  }

  return input.substring(0, maxLength - 3) + "...";
};
