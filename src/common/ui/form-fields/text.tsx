import { forwardRef } from "react";

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components";
import { cn } from "../utils";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type: "email" | "text" | "number" | "tel" | "url";
  label: string;
  labelExtension?: React.ReactNode;
  fieldExtension?: React.ReactNode;
  appendix?: string | null;
  description?: string;
  customErrorMessage?: string | null;
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
      description,
      customErrorMessage,
      ...props
    },

    ref,
  ) => {
    const appendixElement = appendix ? (
      <span
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
      <div
        un-border="rounded-l-md rounded-r-none"
        un-flex="~"
        un-items="center"
        un-justify="center"
      >
        {fieldExtension}
      </div>
    ) : null;

    return (
      <FormItem>
        <div un-flex="~" un-justify="between" un-items="center" un-gap="2">
          <FormLabel className="font-500 text-sm text-neutral-950">
            {label}
          </FormLabel>

          {labelExtension ??
            (props.required ? null : (
              <span className="line-height-none text-sm text-neutral-600">
                (optional)
              </span>
            ))}
        </div>

        <div
          un-border="1 b-2 important:input rounded-md opacity-100"
          un-w="full"
          un-flex="~"
          un-items="center"
          un-bg="transparent"
          className={cn(
            "text-sm ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "disabled:cursor-not-allowed disabled:opacity-50",

            {
              "pr-4": appendixElement !== null,
            },

            className,
          )}
        >
          {fieldExtensionElement}

          <FormControl>
            <input
              {...fieldProps}
              className={cn("min-h-5 rounded-l-md px-4 py-3", {
                "rounded-r-md": appendixElement === null,
              })}
              un-focus-visible={
                fieldExtensionElement !== null && appendixElement !== null
                  ? "rounded-l-none border-inset pl-3.5 border-l-2 border-input outline-none"
                  : undefined
              }
              un-w="full"
              un-placeholder="text-muted-foreground"
            />
          </FormControl>

          {appendixElement}
        </div>

        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage>{customErrorMessage}</FormMessage>
      </FormItem>
    );
  },
);

TextField.displayName = "TextField";
