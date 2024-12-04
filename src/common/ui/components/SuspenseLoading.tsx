import { LazyLoadImage } from "react-lazy-load-image-component";

import { PLATFORM_NAME } from "@/common/_config";
import { cn } from "@/common/ui/utils";

export const SuspenseLoading = () => {
  return (
    <div className="mt-[40vh] flex w-full flex-col items-center">
      <span className="loader"></span>

      <div className={cn("hover:decoration-none decoration-none mt-6 flex items-baseline gap-2")}>
        <LazyLoadImage src="/favicon.png" alt="logo" width={28.72} height={23.94} />

        <span
          className={cn("prose text-2xl font-bold uppercase text-neutral-950 max-[480px]:text-lg")}
        >
          {PLATFORM_NAME}
        </span>
      </div>
    </div>
  );
};
