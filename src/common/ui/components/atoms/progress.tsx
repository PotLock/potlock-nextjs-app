import { forwardRef } from "react";

import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "../../utils";

export type ProgressProps = ProgressPrimitive.ProgressProps;

export const Progress = forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    bgColor?: string;
  }
>(({ className, value, bgColor = "#ECC113", ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("bg-secondary relative h-4 w-full overflow-hidden rounded-full", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 transition-all"
      style={{
        backgroundColor: bgColor,
        transform: `translateX(-${100 - (value || 0)}%)`,
      }}
    />
  </ProgressPrimitive.Root>
));

Progress.displayName = ProgressPrimitive.Root.displayName;
