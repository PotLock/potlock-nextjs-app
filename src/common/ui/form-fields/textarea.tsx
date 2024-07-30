import { forwardRef } from "react";

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
  TextareaProps,
} from "../components";
import { cn } from "../utils";

export type TextAreaFieldProps = TextareaProps & {
  label: string;
  labelExtension?: React.ReactNode;
  description?: string;
  customErrorMessage?: string | null;
};

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  TextAreaFieldProps
>(
  (
    {
      disabled,
      label,
      labelExtension,
      description,
      customErrorMessage,
      ...props
    },

    ref,
  ) => {
    const fieldProps = { disabled, ref, ...props };

    return (
      <FormItem>
        <div un-flex="~" un-justify="between" un-items="center" un-gap="2">
          <FormLabel className="font-500 text-sm text-neutral-950">
            {label}
          </FormLabel>

          {labelExtension ?? props.required ? null : (
            <span className="line-height-none text-sm text-neutral-600">
              (optional)
            </span>
          )}
        </div>

        <FormControl>
          <Textarea
            {...fieldProps}
            className={cn("rounded-md")}
            un-w="full"
            un-placeholder="text-muted-foreground"
          />
        </FormControl>

        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage>{customErrorMessage}</FormMessage>
      </FormItem>
    );
  },
);

TextAreaField.displayName = "TextAreaField";
