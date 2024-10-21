import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "../../utils";

// TODO: add correct hover effects
const buttonVariants = cva(
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
          "bg-[var(--primary-600)] translate-y-[-1.5px] text-white shadow-button-primary hover:translate-y-0",
          "hover:shadow-[0px_0px_0px_1px_rgba(0,0,0,0.84)_inset,0px_1px_1px_1px_rgba(246,118,122,0.5)_inset,0px_0px_0px_2px_rgba(246,118,122,0.5)_inset]",
          "disabled:text-[#a6a6a6] disabled:shadow-[0px_0px_0px_1px_rgba(15,15,15,0.15)_inset] disabled:bg-[var(--neutral-100)]",
        ),

        "brand-tonal": cn(
          "translate-y-[-1.5px] bg-[var(--peach-50)] shadow-button-tonal hover:translate-y-0",
          "hover:shadow-[0px_0px_0px_1px_rgba(0,0,0,0.84)_inset,0px_1px_1px_1px_#fff_inset,0px_0px_0px_2px_rgba(255,255,255,0.8)_inset]",
          "disabled:text-[#a6a6a6] disabled:shadow-[0px_0px_0px_1px_rgba(15,15,15,0.15)_inset] disabled:bg-[var(--neutral-100)]",
        ),

        "brand-plain": cn(
          "text-[color:var(--primary-600)] p-0 hover:text-[color:var(--Primary-400)]",
          "disabled:text-[#a6a6a6] disabled:shadow-[0px_0px_0px_1px_rgba(15,15,15,0.15)_inset] disabled:bg-[var(--neutral-100)]",
        ),

        "brand-outline": cn(
          "bg-[rgba(255,255,255,0.01)] text-[color:var(--primary-600)] hover:bg-[#fef3f2]",
          "shadow-[0px_0px_0px_1px_rgba(243,78,95,0.78)_inset,0px_-1px_0px_0px_rgba(73,8,19,0.5)_inset,0px_1px_2px_-0.5px_rgba(73,8,19,0.2)]",
          "disabled:text-[#c7c7c7] disabled:shadow-[0px_0px_0px_1px_rgba(15,15,15,0.15)_inset]",
        ),

        // sec-brand
        "sec-brand-filled": cn(
          "bg-#fce9d5 shadow-amber outline-none translate-y-[-1.5px] text-#91321B font-bold border border-#f4b37d border-solid hover:translate-y-0 focus:shadow-#f4b37d",
          "hover:shadow-[0px_0px_0px_1px_rgba(244, 179, 125, 1)_inset,0px_1px_1px_1px_rgba(252, 233, 213, 1)_inset,0px_0px_0px_2px_rgba(252, 233, 213, 1)_inset]",
          "disabled:text-[#a6a6a6] disabled:shadow-[0px_0px_0px_1px_rgba(15,15,15,0.15)_inset] disabled:bg-[var(--neutral-100)]",
        ),

        // Standard
        "standard-filled": cn(
          "text-[white] bg-[var(--neutral-800)]",
          "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.84)_inset,0px_1px_1px_1px_rgba(166,166,166,0.4)_inset,0px_0px_0px_2px_rgba(166,166,166,0.4)_inset,0px_1px_2px_0px_rgba(15,15,15,0.15),0px_1px_3px_-1px_rgba(5,5,5,0.08)]",
          "disabled:text-[#a6a6a6] disabled:shadow-[0px_0px_0px_1px_rgba(15,15,15,0.15)_inset] disabled:bg-[var(--neutral-100)]",
        ),

        "standard-outline": cn(
          "bg-white hover:bg-[var(--neutral-50) outline-none focus:shadow-[0px_0px_0px_1px_rgba(0,0,0,0.22)_inset,0px_-1px_0px_0px_rgba(15,15,15,0.15)_inset,0px_1px_2px_-0.5px_rgba(5,5,5,0.08)]",
          "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.22)_inset,0px_-1px_0px_0px_rgba(15,15,15,0.15)_inset,0px_1px_2px_-0.5px_rgba(5,5,5,0.08)]",
          "disabled:text-[#c7c7c7] disabled:shadow-[0px_0px_0px_1px_rgba(15,15,15,0.15)_inset]",
        ),

        "standard-plain": cn(
          "p-0 hover:text-[color:var(--neutral-500)]",
          "disabled:text-[#a6a6a6] disabled:shadow-[0px_0px_0px_1px_rgba(15,15,15,0.15)_inset] disabled:bg-[var(--neutral-100)]",
        ),

        // Tonal
        "tonal-filled": cn(
          "text-[#292929] bg-[#FEF6EE]",
          "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.84)_inset,0px_1px_1px_1px_rgba(166,166,166,0.4)_inset,0px_0px_0px_2px_rgba(166,166,166,0.4)_inset,0px_1px_2px_0px_rgba(15,15,15,0.15),0px_1px_3px_-1px_rgba(5,5,5,0.08)]",
          "disabled:text-[#a6a6a6] disabled:shadow-[0px_0px_0px_1px_rgba(15,15,15,0.15)_inset] disabled:bg-[var(--neutral-100)]",
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, font, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, font, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
