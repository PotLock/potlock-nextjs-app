import { forwardRef } from "react";

import { NATIVE_TOKEN_ID } from "@/common/constants";
import { TextField } from "@/common/ui/form/components";
import { FormControl, FormItem, FormLabel } from "@/common/ui/layout/components";
import { useTokenUsdDisplayValue } from "@/entities/_shared/token";

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export type NearInputFieldProps = InputFieldProps & {
  label: string;
  labelExtension?: React.ReactNode;
  hint?: string;
  customErrorMessage?: string | null;
};

export const NearInputField = forwardRef<HTMLInputElement, NearInputFieldProps>(
  ({ disabled, className, label, labelExtension, ...props }) => {
    const usdAmountFloat = useTokenUsdDisplayValue({
      tokenId: NATIVE_TOKEN_ID,
      amountFloat: props.value ? parseFloat(props.value.toString()) : 0.0,
    });

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
          <TextField
            {...props}
            type="number"
            appendix={usdAmountFloat || "$0.00"}
            disabled={disabled}
            step={0.01}
            classNames={{ root: className }}
            placeholder="0.00"
            inputExtension="NEAR"
          />
        </FormControl>
      </FormItem>
    );
  },
);

NearInputField.displayName = "NearInputField";
