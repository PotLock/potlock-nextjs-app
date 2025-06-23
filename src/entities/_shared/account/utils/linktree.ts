import { ACCOUNT_PROFILE_URL_PATTERNS } from "../constants";
import type { AccountProfileLinktreeKey } from "../types";

/**
 * Returns a function that extracts a raw identifier from the specific linktree url.
 */
export const getLinktreeLeafExtractor = (key: AccountProfileLinktreeKey) => (url: string) =>
  ACCOUNT_PROFILE_URL_PATTERNS[key].test(url)
    ? ACCOUNT_PROFILE_URL_PATTERNS[key].exec(url)?.at(1)
    : url;
