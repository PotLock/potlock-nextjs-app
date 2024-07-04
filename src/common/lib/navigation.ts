import { useCallback, useMemo } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type RouteParams = Record<string, string | undefined>;

/**
 * Provides a method to update the search parameters for the current URL,
 *  without changing the route path itself.
 *
 * @example
 * const { syncRouteParams } = useSearchParamsNavigation();
 *
 * // Sets `accountId` search parameter to "root.near"
 * syncRouteParams({ accountId: "root.near" });
 *
 * // Deletes `transactionHashes` search parameter
 * syncRouteParams({ transactionHashes: undefined });
 */
export const useSearchParamsNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentQueryString = useSearchParams().toString();

  const searchParamsDecoded = useMemo(
    () => new URLSearchParams(currentQueryString),
    [currentQueryString],
  );

  const syncRouteParams = useCallback(
    (newParams: RouteParams) => {
      Object.entries(newParams).forEach(([key, value]) =>
        value
          ? searchParamsDecoded.set(key, value)
          : searchParamsDecoded.delete(key),
      );

      router.push(`${pathname}?${searchParamsDecoded.toString()}`);
    },

    [pathname, router, searchParamsDecoded],
  );

  return { syncRouteParams };
};
