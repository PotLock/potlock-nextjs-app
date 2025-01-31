import { NATIVE_TOKEN_ID } from "@/common/constants";
import type { ByTokenId } from "@/common/types";
import { SelectField, SelectFieldOption, SelectFieldProps } from "@/common/ui/form-fields";
import { useWalletUserSession } from "@/common/wallet";

import { useToken, useTokenAllowlist } from "../hooks/data";

const TokenSelectorOption: React.FC<ByTokenId> = ({ tokenId }) => {
  const viewer = useWalletUserSession();

  const { data: token } = useToken({
    tokenId,
    balanceCheckAccountId: viewer?.accountId,
  });

  switch (tokenId) {
    case NATIVE_TOKEN_ID: {
      return (
        <SelectFieldOption value={tokenId}>
          {token?.metadata.symbol ?? NATIVE_TOKEN_ID.toUpperCase()}
        </SelectFieldOption>
      );
    }

    default: {
      // TODO: render as null if the user has zero balance

      if (token) {
        return <SelectFieldOption value={tokenId}>{token.metadata.symbol}</SelectFieldOption>;
      } else return null;
    }
  }
};

export type TokenSelectorProps = Pick<
  SelectFieldProps,
  "disabled" | "defaultValue" | "onValueChange"
> & {};

export const TokenSelector: React.FC<TokenSelectorProps> = ({ ...props }) => {
  const { data: tokenAllowlist } = useTokenAllowlist();

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
      {tokenAllowlist.map((tokenId) => (
        <TokenSelectorOption key={tokenId} {...{ tokenId }} />
      ))}
    </SelectField>
  );
};
