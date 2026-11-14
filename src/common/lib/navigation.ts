import { useCallback, useMemo } from "react";

import { useRouter } from "next/router";

/**
 * Allows updating and retrieving ( parsed ) URL query parameters for the current route.
 *
 * **Note:** This is meant to be used only with the Next.js's Pages Router.
 *
 * @example
 *
 * const {
 *   query: { accountId, transactionHashes },
 *   setSearchParams,
 * } = useRouteQuery();
 *
 * // Sets `accountId` query parameter to "root.near"
 * setSearchParams({ accountId: "root.near" });
 *
 * console.info(accountId); -> "root.near"
 *
 * // Deletes `transactionHashes` query parameter
 * setSearchParams({ transactionHashes: null });
 *
 * console.info(transactionHashes); -> undefined
 */
export const useRouteQuery = () => {
  const { pathname, query, replace } = useRouter();

  const params = useMemo(() => new Map(Object.entries(query)), [query]);

  const setSearchParams = useCallback(
    (newParams: Record<string, string | null>) => {
      Object.entries(newParams).forEach(([key, value]) =>
        value ? params.set(key, value) : params.delete(key),
      );

      replace({
        pathname,
        query: Object.fromEntries(params),
      });
    },

    [pathname, params, replace],
  );

  return { query, setSearchParams };
};
