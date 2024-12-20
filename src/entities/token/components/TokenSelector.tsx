import { NATIVE_TOKEN_ID } from "@/common/constants";
import { authHooks } from "@/common/services/auth";
import { tokenHooks } from "@/common/services/token";
import type { ByTokenId } from "@/common/types";
import { SelectField, SelectFieldOption, SelectFieldProps } from "@/common/ui/form-fields";

const TokenSelectorOption: React.FC<ByTokenId> = ({ tokenId }) => {
  const userSession = authHooks.useUserSession();

  const { data: token } = tokenHooks.useToken({
    tokenId,
    balanceCheckAccountId: userSession?.accountId,
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
  const { data: tokenAllowlist } = tokenHooks.useAllowlist();

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
