import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { cn } from "../utils";

/**
 * Full-page loading overlay that shows during page navigations.
 * Only shows when navigating to a different page (not on query param changes).
 */
export const PageTransitionLoader = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) => {
      const currentPath = router.asPath.split("?")[0];
      const targetPath = url.split("?")[0];

      if (currentPath === targetPath) {
        return;
      }

      const isCampaignPageTarget = targetPath.startsWith("/campaign/");

      if (isCampaignPageTarget) {
        setIsLoading(true);
      }
    };

    const handleComplete = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleError);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleError);
    };
  }, [router]);

  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center",
        "bg-white/80 backdrop-blur-sm",
        "transition-opacity duration-200",
      )}
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative h-12 w-12">
          <div className={cn("absolute inset-0 rounded-full", "border-4 border-gray-200")} />
          <div
            className={cn(
              "absolute inset-0 rounded-full",
              "border-4 border-transparent border-t-[#dd3345]",
              "animate-spin",
            )}
          />
        </div>
        <p className="text-sm font-medium text-gray-600">Loading...</p>
      </div>
    </div>
  );
};
