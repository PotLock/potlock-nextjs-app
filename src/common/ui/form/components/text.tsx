import { forwardRef, useCallback, useMemo } from "react";

import { getDecimalSeparator } from "@/common/lib/numeric";

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../layout/components";
import { cn } from "../../layout/utils";

export type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> & {
  type: "email" | "text" | "number" | "tel" | "url" | "datetime-local";
  label?: string;
  labelExtension?: React.ReactNode;
  inputExtension?: React.ReactNode;
  appendix?: React.ReactNode;
  hint?: string;
  customErrorMessage?: string | null;

  classNames?: {
    root?: string;
    fieldRoot?: string;
    input?: string;
  };
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      disabled,
      label,
      labelExtension,
      inputExtension = null,
      appendix,
      hint,
      customErrorMessage,
      classNames,
      ...props
    },

    ref,
  ) => {
    const fieldProps = { disabled, ref, ...props };
    const { required } = props;

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback(
      (event) => {
        if (props.type === "number") {
          const isCommaDecimalSeparator = getDecimalSeparator() === ",";

          // Disallow dot if decimal separator is comma
          if (isCommaDecimalSeparator && event.key === ".") {
            event.preventDefault();
          }

          // Disallow comma if decimal separator is dot
          if (!isCommaDecimalSeparator && event.key === ",") {
            event.preventDefault();
          }
        }
      },

      [props.type],
    );

    const labelElement = useMemo(
      () =>
        (label ?? labelExtension) ? (
          <div un-flex="~" un-justify="between" un-items="center" un-gap="2">
            <div un-flex="~" un-items="center" un-gap="1">
              {label && <FormLabel className="text-sm">{label}</FormLabel>}

              {required && <span className="line-height-none text-destructive text-xl">*</span>}
            </div>

            {labelExtension ? (
              <>
                {typeof labelExtension === "string" ? (
                  <span className="line-height-none text-sm text-neutral-600">
                    {labelExtension}
                  </span>
                ) : (
                  labelExtension
                )}
              </>
            ) : (
              !required && (
                <span className="line-height-none text-sm text-neutral-600">(optional)</span>
              )
            )}
          </div>
        ) : null,

      [label, labelExtension, required],
    );

    const inputExtensionElement = useMemo(
      () =>
        inputExtension ? (
          <div
            un-border="rounded-l-md rounded-r-none"
            un-flex="~"
            un-items="center"
            un-justify="center"
          >
            {typeof inputExtension === "string" ? (
              <span className="prose pl-4 pr-2 text-neutral-500">{inputExtension}</span>
            ) : (
              inputExtension
            )}
          </div>
        ) : null,

      [inputExtension],
    );

    const appendixElement = useMemo(
      () =>
        appendix ? (
          <span className="prose flex items-center text-nowrap text-gray-500 sm:text-sm">
            {appendix}
          </span>
        ) : null,

      [appendix],
    );

    return (
      // TODO: Move FormField wrapper from target parent layouts to here

      <FormItem className={classNames?.root}>
        {labelElement}

        <div
          className={cn(
            "h-10.5 flex w-full items-center",
            "border-1 rounded-md border border-neutral-300",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "disabled:cursor-not-allowed disabled:opacity-50",
            { "pr-3": appendixElement !== null },
            classNames?.fieldRoot,
          )}
        >
          {inputExtensionElement}

          <FormControl>
            <input
              {...fieldProps}
              onKeyDown={handleKeyDown}
              className={cn(
                "placeholder-text-muted-foreground h-10 w-full rounded-md border-none px-3 py-2.5",

                {
                  "mr-2.5": appendixElement !== null,

                  "focus-visible:rounded-l-none focus-visible:pl-2.5 focus-visible:outline-none":
                    inputExtensionElement !== null && appendixElement !== null,

                  "focus-visible:border-inset focus-visible:border-l focus-visible:border-l-2 focus-visible:border-neutral-300":
                    inputExtensionElement !== null && appendixElement !== null,
                },
              )}
            />
          </FormControl>

          {appendixElement}
        </div>

        {hint && <FormDescription>{hint}</FormDescription>}
        <FormMessage>{customErrorMessage}</FormMessage>
      </FormItem>
    );
  },
);

TextField.displayName = "TextField";
