import * as React from "react";

import { CircleAlert } from "lucide-react";

import { cn } from "../../utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const errorClasses =
  "shadow-[0px_0px_0px_2px_#ED464F_inset,0px_0px_0px_4px_rgba(252,207,207,0.50)]";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col">
        <input
          type={type}
          className={cn(
            "bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm shadow-[0px_0px_0px_1px_#00000038_inset,0px_-1px_1px_0px_#00000038_inset] file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && errorClasses,
            className,
          )}
          ref={ref}
          {...props}
        />
        {/* Error text */}
        {error && (
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="color-[#ED464F] text-xs">{error}</div>
            <div>
              <CircleAlert color="#ffffff" fill="#ED464F" size={18} />
            </div>
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
