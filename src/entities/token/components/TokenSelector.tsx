import { useMemo } from "react";

import { values } from "remeda";

import { tokenService } from "@/common/services";
import { SelectField, SelectFieldOption, SelectFieldProps } from "@/common/ui/form-fields";

export type TokenSelectorProps = Pick<
  SelectFieldProps,
  "disabled" | "defaultValue" | "onValueChange"
> & {};

export const TokenSelector: React.FC<TokenSelectorProps> = ({ ...props }) => {
  const { data: registeredFts = {} } = tokenService.useTokenRegistry();
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
      {tokenOptions.map((token) =>
        token && (token.balanceFloat ?? 0) > 0 ? (
          <SelectFieldOption key={token.tokenId} value={token.tokenId}>
            {token.metadata.symbol}
          </SelectFieldOption>
        ) : null,
      )}
    </SelectField>
  );
};
