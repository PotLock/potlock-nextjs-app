import { Skeleton } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";

export const CampaignCardSkeleton = () => {
  return (
    <div
      className={cn(
        "min-h-144 max-w-105 w-full rounded-lg md:max-w-full",
        "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_2px_2px_-1px_rgba(5,5,5,0.08),0px_3px_5px_0px_rgba(5,5,5,0.08)]",
      )}
    >
      {/* Cover Image Skeleton */}
      <div className="relative h-[212px] w-full">
        <Skeleton className="h-52 w-full rounded-t-lg" />
        {/* Title overlay skeleton */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-3">
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-col gap-4 px-6 py-6">
        {/* FOR section skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-8" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Description skeleton */}
        <div className="h-[100px] space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Progress bar skeleton */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="flex items-center justify-between text-xs">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* Donate button skeleton */}
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
};

