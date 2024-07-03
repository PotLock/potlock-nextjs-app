import { useCallback, useMemo } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Provides a method to update the search parameters for the current URL,
 *  without changing the route path itself.
 *
 * @example
 * const { syncRouteParams } = useSearchParamsNavigation();
 *
 * syncRouteParams({ accountId: "root.near" });
 */
export const useSearchParamsNavigation = (): {
  syncRouteParams: (newParams: Record<string, string>) => void;
} => {
  const router = useRouter();
  const pathname = usePathname();
  const currentQueryString = useSearchParams().toString();

  const searchParamsDecoded = useMemo(
    () => new URLSearchParams(currentQueryString),
    [currentQueryString],
  );

  const syncRouteParams = useCallback(
    (newParams: Record<string, string>) => {
      Object.entries(newParams).forEach(([key, value]) =>
        searchParamsDecoded.set(key, value),
      );

      router.push(`${pathname}?${searchParamsDecoded.toString()}`);
    },

    [pathname, router, searchParamsDecoded],
  );

  return { syncRouteParams };
};
