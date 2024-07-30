import { forwardRef } from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "../utils";

const alertVariants = cva(
  cn(
    "relative w-full rounded-lg border p-4 gap-2",
    "[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
    "[&>svg]:text-foreground",
  ),

  {
    variants: {
      variant: {
        default: "bg-background text-foreground",

        warning: "border-[#F0CF1F] bg-[#FBF9C6] text-[#3F2209]",

        destructive: cn(
          "border-destructive/50 text-destructive dark:border-destructive",
          "[&>svg]:text-destructive",
        ),
      },
    },

    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));

Alert.displayName = "Alert";

const AlertTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "prose font-400 important:pl-8 mb-2 leading-5 tracking-normal",
      className,
    )}
    {...props}
  />
));

AlertTitle.displayName = "AlertTitle";

const AlertDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "prose important:pl-8 text-sm [&_p]:leading-relaxed",
      className,
    )}
    {...props}
  />
));

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
