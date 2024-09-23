import { forwardRef } from "react";

import { CircleAlert } from "lucide-react";

import { cn } from "../utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps & {
    error?: string;
    showHint?: boolean;
    currentText?: string;
    maxCharacters?: number;
  }
>(
  (
    {
      className,
      error,
      showHint,
      currentText = "",
      maxCharacters = 500,
      ...props
    },
    ref,
  ) => {
    return (
      <>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full px-3 py-2.5",
            "rounded-md border border-neutral-300 bg-background ring-offset-background",
            "text-sm placeholder:text-muted-foreground",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        {showHint && (
          <div className="mt-2 flex w-full justify-between text-[12px] text-neutral-600">
            <p>Hint text</p>
            <p>
              {currentText.length}/{maxCharacters}
            </p>
          </div>
        )}
        {error && (
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="color-[#ED464F] text-xs">{error}</div>
            <div>
              <CircleAlert color="#ffffff" fill="#ED464F" size={18} />
            </div>
          </div>
        )}
      </>
    );
  },
);

Textarea.displayName = "Textarea";
