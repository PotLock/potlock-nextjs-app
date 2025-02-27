import { Skeleton } from "@/common/ui/layout/components";

export const AccountCardSkeleton = () => {
  return (
    <div className="bg-background mx-auto flex h-full w-full  max-w-[420px] flex-col overflow-hidden rounded-xl border border-solid border-[#dbdbdb] shadow-[0px_-2px_0px_#dbdbdb_inset] transition-all duration-300 hover:translate-y-[-1rem]">
      {/* Background */}
      <div className="relative h-[145px] w-full">
        <Skeleton className="h-full w-full" />
      </div>
      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 px-6 pb-6">
        {/* Profile image */}
        <div className="relative -mt-5 h-10 w-10">
          <Skeleton className="h-full w-full rounded-full" />
        </div>
        {/* Name */}
        <div className="w-full text-base font-semibold text-[#2e2e2e]">
          <Skeleton className="h-4 w-12" />
        </div>
        {/* Description */}
        <div className="text-base font-normal text-[#2e2e2e]">
          <Skeleton className="h-9 w-full" />
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-base">
          {Array.from({ length: 4 }, (_, index) => `key_${index}`).map((key) => (
            <Skeleton className="h-9 w-24" key={key} />
          ))}
        </div>
        {/* Donations Info */}
        <div className="mt-auto flex items-center gap-4">
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
};
