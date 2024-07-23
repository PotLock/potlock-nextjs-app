import { useCallback, useMemo } from "react";

import { useRouter } from "next/router";
import { useUrlSearchParams } from "use-url-search-params";

export const useParsedRouteQuery = () => {
  const [searchParams] = useUrlSearchParams();

  return useMemo(() => new Map(Object.entries(searchParams)), [searchParams]);
};

/**
 * Provides a method to update URL query parameters for the current route.
 *
 * @example
 * const { syncRouteQuery } = useRouteQuerySync();
 *
 * // Sets `accountId` query parameter to "root.near"
 * syncRouteQuery({ accountId: "root.near" });
 *
 * // Deletes `transactionHashes` query parameter
 * syncRouteQuery({ transactionHashes: null });
 */
export const useRouteQuerySync = () => {
  const router = useRouter();

  const searchParams = useParsedRouteQuery();

  const syncRouteQuery = useCallback(
    (newParams: Record<string, string | null>) => {
      Object.entries(newParams).forEach(([key, value]) =>
        value ? searchParams.set(key, value) : searchParams.delete(key),
      );

      router.replace(router.pathname, Object.fromEntries(searchParams));
    },

    [router, searchParams],
  );

  return { syncRouteQuery };
};
