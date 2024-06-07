import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "../utils";

// TODO: add hover effects correctly & disabled styling
const buttonVariants = cva(
  "flex text-sm leading-[157%] items-center justify-center text-[#292929] gap-2 font-medium no-underline cursor-pointer transition-all duration-200 ease-in-out w-fit rounded-md border-none focus:shadow-button-focus",
  {
    variants: {
      variant: {
        // Brand
        "brand-filled":
          "bg-[var(--primary-600)] translate-y-[-1.5px] text-white shadow-button-primary hover:translate-y-0 hover:shadow-[0px_0px_0px_1px_rgba(0,0,0,0.84)_inset,0px_1px_1px_1px_rgba(246,118,122,0.5)_inset,0px_0px_0px_2px_rgba(246,118,122,0.5)_inset]",
        "brand-tonal":
          "translate-y-[-1.5px] bg-[var(--peach-50)] shadow-button-tonal hover:shadow-[0px_0px_0px_1px_rgba(0,0,0,0.84)_inset,0px_1px_1px_1px_#fff_inset,0px_0px_0px_2px_rgba(255,255,255,0.8)_inset] hover:translate-y-0",
        "brand-plain":
          "text-[color:var(--primary-600)] p-0 hover:text-[color:var(--Primary-400)]",
        "brand-outline":
          "bg-[rgba(255,255,255,0.01)] text-[color:var(--primary-600)] shadow-[0px_0px_0px_1px_rgba(243,78,95,0.78)_inset,0px_-1px_0px_0px_rgba(73,8,19,0.5)_inset,0px_1px_2px_-0.5px_rgba(73,8,19,0.2)] hover:bg-[#fef3f2]",
        // Standard
        "standard-filled":
          "text-[white] bg-[var(--neutral-800)] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.84)_inset,0px_1px_1px_1px_rgba(166,166,166,0.4)_inset,0px_0px_0px_2px_rgba(166,166,166,0.4)_inset,0px_1px_2px_0px_rgba(15,15,15,0.15),0px_1px_3px_-1px_rgba(5,5,5,0.08)]",
        "standard-outline":
          "bg-white bg shadow-[0px_0px_0px_1px_rgba(0,0,0,0.22)_inset,0px_-1px_0px_0px_rgba(15,15,15,0.15)_inset,0px_1px_2px_-0.5px_rgba(5,5,5,0.08)] hover:bg-[var(--neutral-50)",
        "standard-plain": "p-0 hover:text-[color:var(--neutral-500)]",
        // Disabled
        "filled-disabled":
          "text-[#a6a6a6] shadow-[0px_0px_0px_1px_rgba(15,15,15,0.15)_inset] bg-[var(--neutral-100)]",
        "plain-disabled":
          "bg-white  text-[#c7c7c7] shadow-[0px_0px_0px_1px_rgba(15,15,15,0.15)_inset]",
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
