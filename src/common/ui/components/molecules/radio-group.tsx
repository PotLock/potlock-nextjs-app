import { forwardRef } from "react";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { RadioActiveIcon, RadioInactiveIcon } from "@/common/assets/svgs";

import { cn } from "../../utils";
import { Label } from "../atoms/label";
import { Skeleton } from "../atoms/skeleton";

export const RadioGroup = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-3", className)}
      {...props}
      ref={ref}
    />
  );
});

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export type RadioGroupItemProps = Omit<
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
  "color"
> & {
  isLoading?: boolean;
  id: string;
  label: string;
  hint?: string;
};

export const RadioGroupItem = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ isLoading, className, checked, disabled, label, hint, ...props }, ref) => {
  const inputProps = { checked, disabled, ...props };

  return isLoading ? (
    <Skeleton className="h-12.5 w-full" />
  ) : (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "border-1 rounded-md text-current ring-offset-background",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",

        {
          "border-none bg-neutral-50": disabled,
          "border-neutral-200": !disabled && !checked,

          "color-[var(--primary-600)] border-[var(--primary-600)]":
            !disabled && checked,
        },

        className,
      )}
      {...inputProps}
    >
      <div className="flex items-center gap-2 p-4">
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <RadioActiveIcon className="h-6 w-6" width={24} height={24} />
        </RadioGroupPrimitive.Indicator>

        <RadioInactiveIcon
          className="h-6 w-6"
          width={24}
          height={24}
          style={{ display: checked ? "none" : undefined }}
        />

        <Label
          htmlFor={props.id}
          className={cn("flex h-6 items-center gap-2 text-sm", {
            "text-neutral-400": disabled,
          })}
        >
          <span className="font-500 text-current">{label}</span>

          {hint && (
            <span
              className={cn("font-500", {
                "text-neutral-400": disabled,
                "text-neutral-500": !disabled,
              })}
            >
              {hint}
            </span>
          )}
        </Label>
      </div>
    </RadioGroupPrimitive.Item>
  );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
