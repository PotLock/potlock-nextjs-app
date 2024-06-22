"use client";

import { forwardRef } from "react";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { Label } from "./label";
import { Skeleton } from "./skeleton";
import { cn } from "../utils";

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
    <div
      className={cn({
        "border-none bg-neutral-50": disabled,
        "border-neutral-400": !disabled && !checked,

        "color-[var(--primary-600)] border-[var(--primary-600)]":
          !disabled && checked,
      })}
      un-border="1"
      un-rounded="lg"
      un-flex="~"
      un-items="center"
      un-gap="2"
      un-p="4"
    >
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          "aspect-square h-4 w-4 rounded-full border border-inherit text-current",
          "ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...inputProps}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Circle className="h-2.5 w-2.5 fill-current text-current" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>

      <Label
        htmlFor={props.id}
        className={cn("flex gap-1", {
          "text-neutral-400": disabled,
          "text-neutral-950": !disabled,
        })}
      >
        <span un-font="500">{label}</span>

        {hint && (
          <span
            un-font="500"
            className={cn({
              "text-neutral-400": disabled,
              "text-neutral-500": !disabled,
            })}
          >
            {hint}
          </span>
        )}
      </Label>
    </div>
  );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
