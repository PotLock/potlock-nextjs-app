import { forwardRef, useState } from "react";

import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "../../utils";

export type ProgressProps = ProgressPrimitive.ProgressProps;

export const Progress = forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    bgColor?: string;
    minValuePercentage?: number;
    minArrowColor?: string;
    baseColor?: string;
    minAmount?: string;
  }
>(
  (
    {
      className,
      value,
      bgColor = "#ECC113",
      minValuePercentage,
      minArrowColor,
      baseColor = "#FEE6E5",
      minAmount,
      ...props
    },
    ref,
  ) => {
    let clampedMinValuePercentage = minValuePercentage;

    if (minValuePercentage !== undefined) {
      clampedMinValuePercentage = Math.max(2.8, Math.min(91.5, minValuePercentage));
    }

    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className="relative w-full transition-opacity duration-200" // Add opacity transition to parent div
        onMouseEnter={() => setIsHovered(true)}
        onClick={(e) => e.stopPropagation()}
        onMouseLeave={() => setIsHovered(false)}
        style={{ opacity: isHovered ? 0.8 : 1 }} // Fade progress bar on hover
      >
        <ProgressPrimitive.Root
          ref={ref}
          className={cn(`h-4 w-full overflow-hidden rounded-full`, className)}
          style={{ backgroundColor: baseColor }}
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

        {minValuePercentage !== undefined && (
          <div
            className={`absolute ${isHovered ? "bottom-[-39px]" : "bottom-[-44px]"} flex transform flex-col items-center transition-all duration-200`}
            style={{
              left: `${clampedMinValuePercentage}%`, // Shift arrow on hover
            }}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 10 10"
              fill={minArrowColor || "#FEE6E5"}
              stroke={minArrowColor || "gray"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <path d="M1 1L5 9L9 1" />
            </svg>
            <div
              className=" mt-1 flex flex-col items-center whitespace-nowrap text-[10px] font-semibold text-gray-500 transition-opacity duration-200" // Add transition to text
              style={{ opacity: isHovered ? 1 : 0 }} // Fade in text on hover
            >
              MIN.
              <p className="m-0 font-semibold">{minAmount}</p>
            </div>
          </div>
        )}
      </div>
    );
  },
);

Progress.displayName = ProgressPrimitive.Root.displayName;
