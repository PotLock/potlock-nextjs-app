import { forwardRef } from "react";

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
  TextareaProps,
} from "../../layout/components";
import { cn } from "../../layout/utils";

export type TextAreaFieldProps = TextareaProps & {
  label: string;
  labelExtension?: React.ReactNode;
  hint?: string;
  customErrorMessage?: string | null;
};

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ disabled, label, labelExtension, hint, customErrorMessage, ...props }, ref) => {
    const fieldProps = { disabled, ref, ...props };
    const { maxLength, value } = props;
    const currentLength = typeof value === "string" ? value?.length : 0;

    return (
      <FormItem>
        <div un-flex="~" un-justify="between" un-items="center" un-gap="2">
          <div un-flex="~" un-items="center" un-gap="1">
            {label && <FormLabel className="font-500 text-sm">{label}</FormLabel>}

            {props.required && <span className="line-height-none text-destructive text-xl">*</span>}
          </div>

          {labelExtension ??
            (!props.required && (
              <span className="line-height-none text-sm text-neutral-600">(optional)</span>
            ))}
        </div>

        <FormControl>
          <Textarea
            {...fieldProps}
            className={cn("rounded-md")}
            un-w="full"
            un-placeholder="text-muted-foreground"
          />
        </FormControl>

        <FormDescription className="">
          {hint && <span>{hint}</span>}

          <span className="prose ml-auto">
            {typeof maxLength === "number" ? `${currentLength}/${maxLength}` : currentLength}
          </span>
        </FormDescription>

        <FormMessage>{customErrorMessage}</FormMessage>
      </FormItem>
    );
  },
);

TextAreaField.displayName = "TextAreaField";
