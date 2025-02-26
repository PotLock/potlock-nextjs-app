import React from "react";

import { Skeleton } from "@/common/ui/layout/components";

export const ListCardSkeleton = () => {
  return (
    <div className="bg-background overflow-hidden rounded-md shadow-md transition-all duration-300 hover:translate-y-[-1rem]">
      <div className="relative">
        {/* Skeleton for the cover image */}
        <Skeleton className="h-[150px] w-full" />
        <div className="absolute right-0 top-0 h-[150px] w-[150px] bg-black bg-opacity-10">
          <div className="flex h-[150px] w-full items-center justify-center text-white">
            <Skeleton className="h-6 w-20" /> {/* Placeholder for "30 More" */}
          </div>
        </div>
      </div>
      <div className="p-3">
        {/* Skeleton for the title */}
        <Skeleton className="h-6 w-full" />
        <div className="mt-2 flex items-center space-x-2">
          {/* Skeleton for the profile image */}
          <Skeleton className="h-4 w-4 rounded-full" />
          {/* Skeleton for the owner's name */}
          <Skeleton className="h-4 w-24" />
          {/* Skeleton for the upvote button */}
          <Skeleton className="h-4 w-4" />
          {/* Skeleton for the upvote count */}
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
};
