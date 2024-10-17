import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "../utils";

// TODO: add correct hover effects
const filterChipVariants = cva(
  cn(
    "flex text-sm leading-[157%] items-center justify-center text-[#292929] gap-2 font-medium",
    "no-underline cursor-pointer transition-all duration-200 ease-in-out w-fit rounded-md",
    "border-none focus:shadow-button-focus disabled:cursor-not-allowed",
  ),

  {
    variants: {
      variant: {
        // Brand
        "brand-filled": cn(
          "bg-#fce9d5 shadow-amber outline-none translate-y-[-1.5px] text-#91321B font-bold border border-#f4b37d border-solid hover:translate-y-0 focus:shadow-#f4b37d",
          "hover:shadow-[0px_0px_0px_1px_rgba(244, 179, 125, 1)_inset,0px_1px_1px_1px_rgba(252, 233, 213, 1)_inset,0px_0px_0px_2px_rgba(252, 233, 213, 1)_inset]",
          "disabled:text-[#a6a6a6] disabled:shadow-[0px_0px_0px_1px_rgba(15,15,15,0.15)_inset] disabled:bg-[var(--neutral-100)]",
        ),

        "brand-plain": cn(
          "text-[color:var(--primary-600)] p-0 hover:text-[color:var(--Primary-400)]",
          "disabled:text-[#a6a6a6] disabled:shadow-[0px_0px_0px_1px_rgba(15,15,15,0.15)_inset] disabled:bg-[var(--neutral-100)]",
        ),

        "brand-outline": cn(
          "bg-white hover:bg-[var(--neutral-50) outline-none focus:shadow-[0px_0px_0px_1px_rgba(0,0,0,0.22)_inset,0px_-1px_0px_0px_rgba(15,15,15,0.15)_inset,0px_1px_2px_-0.5px_rgba(5,5,5,0.08)]",
          "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.22)_inset,0px_-1px_0px_0px_rgba(15,15,15,0.15)_inset,0px_1px_2px_-0.5px_rgba(5,5,5,0.08)]",
          "disabled:text-[#c7c7c7] disabled:shadow-[0px_0px_0px_1px_rgba(15,15,15,0.15)_inset]",
        ),
      },

      size: {
        default: "px-4 py-[9px]",
        icon: "h-10 w-10",
      },

      font: {
        default: "font-medium",
        bold: "font-bold",
        semibold: "font-semibold",
      },
    },

    defaultVariants: {
      font: "default",
      variant: "brand-filled",
      size: "default",
    },
  },
);

export interface FilterChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof filterChipVariants> {
  asChild?: boolean;
}

const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ className, variant, font, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(filterChipVariants({ variant, size, font, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

FilterChip.displayName = "FilterChip";

export { FilterChip, filterChipVariants };
