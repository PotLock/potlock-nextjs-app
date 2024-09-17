import { forwardRef, useMemo } from "react";

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components";
import { cn } from "../utils";

export type TextFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  type: "email" | "text" | "number" | "tel" | "url" | "datetime-local";
  label?: string;
  labelExtension?: React.ReactNode;
  inputExtension?: React.ReactNode;
  appendix?: string | null;
  hint?: string;
  customErrorMessage?: string | null;

  classNames?: {
    root?: string;
    inputWrapper?: string;
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

    const labelElement = useMemo(
      () =>
        label ?? labelExtension ? (
          <div un-flex="~" un-justify="between" un-items="center" un-gap="2">
            <div un-flex="~" un-items="center" un-gap="1">
              {label && <FormLabel className="text-sm">{label}</FormLabel>}

              {required && (
                <span className="line-height-none text-xl text-destructive">
                  *
                </span>
              )}
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
                <span className="line-height-none text-sm text-neutral-600">
                  (optional)
                </span>
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
              <span className="prose pl-4 pr-2 text-neutral-500">
                {inputExtension}
              </span>
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
          <span className="prose sm:text-sm flex items-center text-nowrap text-gray-500">
            {appendix}
          </span>
        ) : null,

      [appendix],
    );

    return (
      <FormItem className={classNames?.root}>
        {labelElement}

        <div
          className={cn(
            "flex w-full items-center",
            "border-op-100 border-1 rounded-md border border-input",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "disabled:cursor-not-allowed disabled:opacity-50",
            { "pr-3": appendixElement !== null },
            classNames?.inputWrapper,
          )}
        >
          {inputExtensionElement}

          <FormControl>
            <input
              {...fieldProps}
              className={cn("max-h-11 rounded-md px-3 py-2.5", {
                "mr-2.5": appendixElement !== null,
              })}
              un-focus-visible={
                inputExtensionElement !== null && appendixElement !== null
                  ? "rounded-l-none border-inset pl-2.5 border-l-2 border-input outline-none"
                  : undefined
              }
              un-w="full"
              un-placeholder="text-muted-foreground"
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
