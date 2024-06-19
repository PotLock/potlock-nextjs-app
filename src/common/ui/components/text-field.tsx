import { forwardRef } from "react";

import { cn } from "../utils";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type: "email" | "text" | "number" | "tel" | "url";
  label: string;
  labelExtension?: React.ReactNode;
  fieldExtension?: React.ReactNode;
  appendix?: string | null;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      disabled,
      label,
      labelExtension,
      fieldExtension = null,
      appendix,
      ...props
    },
    ref,
  ) => {
    const appendixElement = appendix ? (
      <span
        un-p="l-1.5 r-3"
        un-flex="~"
        un-items="center"
        un-text="gray-500 sm:sm nowrap"
        className="prose"
      >
        {appendix}
      </span>
    ) : null;

    const fieldProps = { disabled, ref, ...props };

    const fieldExtensionElement = fieldExtension ? (
      <div un-border="rounded-l-lg rounded-r-none" un-h="9.5" un-p="0.5">
        {fieldExtension}
      </div>
    ) : null;

    return (
      <div un-flex="~ col" un-gap="2" className="w-full">
        <div un-flex="~" un-justify="between" un-items="center" un-gap="2">
          <span className="prose" un-text="sm neutral-950" un-font="500">
            {label}
          </span>

          {labelExtension}
        </div>

        <div
          un-border="~ input rounded-lg"
          un-w="full"
          un-h="10"
          un-flex="~"
          un-items="center"
          un-bg="transparent"
          className={cn(
            "text-sm shadow-[0px_0px_0px_1px_#00000038_inset,0px_-1px_1px_0px_#00000038_inset]",
            "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          {fieldExtensionElement}

          <input
            className={cn({
              "rounded-l-lg": fieldExtensionElement === null,
              "mr-1 rounded-r-lg": appendixElement === null,
            })}
            un-focus-visible={
              fieldExtensionElement !== null && appendixElement !== null
                ? "border-inset pl-1.5 border-l-2 border-input outline-none"
                : undefined
            }
            un-pl={fieldExtensionElement === null ? "3" : "1.5"}
            un-pr="1.5"
            un-w="full"
            un-h="9"
            un-placeholder="text-muted-foreground"
            {...fieldProps}
          />

          {appendixElement}
        </div>
      </div>
    );
  },
);

TextField.displayName = "TextField";
