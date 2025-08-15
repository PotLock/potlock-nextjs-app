import React from "react";

import { Skeleton } from "@/common/ui/layout/components";

export const PostCardSkeleton: React.FC = () => {
  return (
    <div className="bg-background mb-4 rounded-lg p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-28" />
          <span className="mx-2 text-gray-300">•</span>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-6 w-6 rounded" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[70%]" />
      </div>

      <div className="mt-4">
        <Skeleton className="h-48 w-full rounded-md" />
      </div>
    </div>
  );
};

export default PostCardSkeleton;
