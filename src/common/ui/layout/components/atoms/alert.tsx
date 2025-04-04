import { forwardRef } from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "../../utils";

const alertVariants = cva(
  cn(
    "flex flex-col relative w-full rounded-lg border p-4 gap-2",
    "[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
    "[&>.spinner~*]:pl-7 [&>.spinner+div]:translate-y-[-3px] [&>.spinner]:absolute",
    "[&>.spinner]:left-4 [&>.spinner]:top-4",
    "[&>svg]:text-foreground [&>.spinner]:text-foreground",
  ),

  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        neutral: "border-neutral-200 bg-neutral-50",
        warning: "border-[#F0CF1F] bg-[#FBF9C6] text-[#3F2209]",

        destructive: cn(
          "border-destructive/50 text-destructive dark:border-destructive",
          "[&>svg]:text-destructive [&>.spinner]:text-destructive",
        ),
      },
    },

    defaultVariants: {
      variant: "default",
    },
  },
);

export type AlertProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & { compact?: boolean };

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, compact = false, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), { "flex-row": compact }, className)}
      {...props}
    />
  ),
);

Alert.displayName = "Alert";

const AlertTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("font-600 important:pl-10 text-[17px] leading-5 tracking-normal", className)}
      {...props}
    />
  ),
);

AlertTitle.displayName = "AlertTitle";

export type AlertDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  inline?: boolean;
};

const AlertDescription = forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, inline = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "font-500 text-sm text-neutral-700 [&_p]:leading-relaxed",
        { "important:pl-0": inline, "important:pl-10": !inline },
        className,
      )}
      {...props}
    />
  ),
);

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
