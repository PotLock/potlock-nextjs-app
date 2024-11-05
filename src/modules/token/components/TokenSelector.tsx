import { useMemo } from "react";

import { values } from "remeda";

import { NATIVE_TOKEN_ID } from "@/common/constants";
import { ftService } from "@/common/services";
import {
  SelectField,
  SelectFieldOption,
  SelectFieldProps,
} from "@/common/ui/form-fields";

export type TokenSelectorProps = Pick<
  SelectFieldProps,
  "disabled" | "defaultValue" | "onValueChange"
> & {};

export const TokenSelector: React.FC<TokenSelectorProps> = ({ ...props }) => {
  const { data: registeredFts = {} } = ftService.useTokenRegistry();
  const tokenOptions = useMemo(() => values(registeredFts), [registeredFts]);

  console.log(props.defaultValue);

  return (
    // TODO: Move FormField wrapper from target parent layouts to here
    //? But do not forget to account for ability to use this component without forms

    <SelectField
      embedded
      label="Available tokens"
      classes={{
        trigger: "mr-2px h-full w-min rounded-r-none shadow-none",
      }}
      {...props}
    >
      <SelectFieldOption value={NATIVE_TOKEN_ID}>
        {NATIVE_TOKEN_ID.toUpperCase()}
      </SelectFieldOption>

      {!props.disabled &&
        tokenOptions.map((token) =>
          token && (token.balanceFloat ?? 0) > 0 ? (
            <SelectFieldOption
              key={token.contract_account_id}
              value={token.contract_account_id}
            >
              {token.metadata.symbol}
            </SelectFieldOption>
          ) : null,
        )}
    </SelectField>
  );
};
