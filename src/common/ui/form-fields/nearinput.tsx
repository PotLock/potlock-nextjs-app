import { forwardRef } from "react";

import { NATIVE_TOKEN_ID } from "@/common/constants";
import { ftService } from "@/common/services";

import { TextField } from "./text";
import { FormControl, FormItem, FormLabel } from "../components";

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export type NearInputFieldProps = InputFieldProps & {
  label: string;
  labelExtension?: React.ReactNode;
  hint?: string;
  customErrorMessage?: string | null;
};

export const NearInputField = forwardRef<HTMLInputElement, NearInputFieldProps>(
  ({ disabled, className, label, labelExtension, ...props }) => {
    const usdAmountFloat = ftService.useTokenUsdDisplayValue({
      tokenId: NATIVE_TOKEN_ID,
      amountFloat: typeof props.value === "number" ? props.value : 0.0,
    });

    return (
      <FormItem>
        <div un-flex="~" un-justify="between" un-items="center" un-gap="2">
          <div un-flex="~" un-items="center" un-gap="1">
            {label && (
              <FormLabel className="font-500 text-sm">{label}</FormLabel>
            )}

            {props.required && (
              <span className="line-height-none text-xl text-destructive">
                *
              </span>
            )}
          </div>

          {labelExtension ??
            (!props.required && (
              <span className="line-height-none text-sm text-neutral-600">
                (optional)
              </span>
            ))}
        </div>

        <FormControl>
          <TextField
            appendix={usdAmountFloat || "$0.00"}
            disabled={disabled}
            classNames={{ root: className }}
            inputExtension="NEAR"
            {...props}
            type="number"
          />
        </FormControl>
      </FormItem>
    );
  },
);

NearInputField.displayName = "NearInputField";
