import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "../../utils";

// TODO: add correct hover effects
const filterChipVariants = cva(
  cn(
    "flex text-sm leading-tight items-center justify-center text-[#292929] gap-2 font-medium",
    "whitespace-nowrap no-underline cursor-pointer transition-all duration-200 ease-in-out w-fit",
    "rounded-md border-none disabled:cursor-not-allowed",
  ),

  {
    variants: {
      variant: {
        // Brand
        "brand-filled": cn(
          "gap-2 text-[#91321b]  hover:translate-y-0 bg-[#fce9d5]",
          "hover:shadow-[0px_0px_0px_1px_rgba(244, 179, 125, 1)_inset,0px_1px_1px_1px_rgba(252, 233, 213, 1)_inset,0px_0px_0px_2px_rgba(252, 233, 213, 1)_inset]",
          "disabled:text-[#a6a6a6] disabled:shadow-[0px_0px_0px_1px_rgba(15,15,15,0.15)_inset] disabled:bg-[var(--neutral-100)]",
        ),

        "brand-plain": cn(
          "text-[color:var(--primary-600)] p-0 hover:text-[color:var(--Primary-400)]",
          "disabled:text-[#a6a6a6] disabled:shadow-[0px_0px_0px_1px_rgba(15,15,15,0.15)_inset] disabled:bg-[var(--neutral-100)]",
        ),

        "brand-outline": cn(
          "bg-white hover:bg-[var(--neutral-50) outline-none",
          "disabled:text-[#c7c7c7] disabled:shadow-[0px_0px_0px_1px_rgba(15,15,15,0.15)_inset]",
        ),
      },

      size: {
        default: "pt-[4.5px] px-4 pb-1.5",
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
  count?: number;
  label?: string;
}

const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
  (
    { className, variant, font, size, asChild = false, label, children, count = 0, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <div
        className={cn("rounded-1.5 pt-0.25 border bg-none", {
          "border-[#f4b37d]": variant === "brand-filled",
          "border-[#dadada]": variant !== "brand-filled",
        })}
      >
        <Comp
          className={cn(filterChipVariants({ variant, size, font, className }))}
          ref={ref}
          {...props}
        >
          {label ?? children}
          {count !== undefined ? (
            <span
              className={cn("rounded-2xl px-1.5 py-0.5 text-xs font-semibold leading-none", {
                "bg-[#f8d3b0]": variant === "brand-filled",
                "bg-[#f7f7f7] text-[#7a7a7a]": variant !== "brand-filled",
              })}
            >
              {count}
            </span>
          ) : (
            ""
          )}
        </Comp>
      </div>
    );
  },
);

FilterChip.displayName = "FilterChip";

export { FilterChip, filterChipVariants };
