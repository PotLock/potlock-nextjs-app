import { useCallback, useMemo } from "react";

import { useRouter } from "next/router";
import queryString from "query-string";
import { useUrlSearchParams } from "use-url-search-params";

/**
 * Allows updating and retrieving ( parsed ) URL query parameters for the current route.
 *
 * **Note:** This is meant to be used only with the Next.js's Pages Router.
 *
 * @example
 *
 * const {
 *   searchParams: { accountId, transactionHashes },
 *   setSearchParams,
 * } = useSearchParams();
 *
 * // Sets `accountId` query parameter to "root.near"
 * setSearchParams({ accountId: "root.near" });
 *
 * console.log(accountId); -> "root.near"
 *
 * // Deletes `transactionHashes` query parameter
 * setSearchParams({ transactionHashes: null });
 *
 * console.log(transactionHashes); -> undefined
 */
export const useSearchParams = () => {
  const router = useRouter();
  const [parsedSearchQuery] = useUrlSearchParams();

  const searchParams = useMemo(
    () => parsedSearchQuery ?? {},
    [parsedSearchQuery],
  );

  const searchParamsMap = useMemo(
    () => new Map(Object.entries(searchParams)),
    [searchParams],
  );

  const setSearchParams = useCallback(
    (newParams: Record<string, string | null>) => {
      Object.entries(newParams).forEach(([key, value]) =>
        value ? searchParamsMap.set(key, value) : searchParamsMap.delete(key),
      );

      const searchQuery = queryString.stringify(
        Object.fromEntries(searchParamsMap),
      );

      router.replace(
        searchQuery.length > 0
          ? [router.pathname, searchQuery].join("?")
          : router.pathname,
      );
    },

    [router, searchParamsMap],
  );

  return { searchParams, setSearchParams };
};
