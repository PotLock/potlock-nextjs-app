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
            "w-full shrink grow basis-0 border-none bg-transparent p-2 text-sm leading-tight text-[#656565] outline-none",
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
