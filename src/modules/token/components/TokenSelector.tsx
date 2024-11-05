import { useMemo } from "react";

import { values } from "remeda";

import { NEAR_TOKEN_DENOM } from "@/common/constants";
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
      <SelectFieldOption value={NEAR_TOKEN_DENOM}>
        {NEAR_TOKEN_DENOM.toUpperCase()}
      </SelectFieldOption>

      {!props.disabled &&
        tokenOptions.map((token) =>
          token && Number(token.balance) > 0 ? (
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
