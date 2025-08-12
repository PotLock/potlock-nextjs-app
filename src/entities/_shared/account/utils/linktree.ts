import { ACCOUNT_PROFILE_URL_PATTERNS } from "../constants";
import type { AccountProfileLinktreeKey } from "../types";

/**
 * Returns a function that extracts a raw identifier from the specific linktree url.
 */
export const getLinktreeLeafExtractor = (key: AccountProfileLinktreeKey) => (url?: string) => {
  if (typeof url === "string" && url.length > 0) {
    return ACCOUNT_PROFILE_URL_PATTERNS[key].test(url)
      ? ACCOUNT_PROFILE_URL_PATTERNS[key].exec(url)?.at(1)
      : url;
  } else return undefined;
};
