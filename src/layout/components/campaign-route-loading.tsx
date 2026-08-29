import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { Spinner } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";

type CampaignRouteLoadingProps = {
  children: React.ReactNode;
};

export const CampaignRouteLoading: React.FC<CampaignRouteLoadingProps> = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) => {
      // Only show loading overlay when navigating to a single campaign page
      if (url.startsWith("/campaign/")) {
        setIsLoading(true);
      }
    };

    const handleEnd = () => setIsLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleEnd);
    router.events.on("routeChangeError", handleEnd);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleEnd);
      router.events.off("routeChangeError", handleEnd);
    };
  }, [router.events]);

  return (
    <>
      <div className={cn("w-full", isLoading && "blur-sm")}>{children}</div>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-xl bg-white/90 px-6 py-5 shadow-lg">
            <Spinner className="h-10 w-10" />
            <p className="text-sm font-medium text-neutral-700">Loading campaign...</p>
          </div>
        </div>
      )}
    </>
  );
};
