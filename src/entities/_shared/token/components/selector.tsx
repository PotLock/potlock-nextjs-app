import { useMemo } from "react";

import { FEATURE_REGISTRY } from "@/common/_config";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import type { ByTokenId } from "@/common/types";
import {
  type ControlledSelectFieldProps,
  SelectField,
  SelectFieldOption,
  SelectFieldProps,
  type UncontrolledSelectFieldProps,
} from "@/common/ui/form/components";
import { useWalletUserSession } from "@/common/wallet";

import { useToken, useTokenAllowlist } from "../hooks/data";

type TokenSelectorOptionProps = ByTokenId & {
  showBalance?: boolean;
  skipIfZeroBalance?: boolean;
};

const TokenSelectorOption: React.FC<TokenSelectorOptionProps> = ({
  tokenId,
  showBalance,
  skipIfZeroBalance,
}) => {
  const viewer = useWalletUserSession();

  const { data: token } = useToken({
    tokenId,
    balanceCheckAccountId: showBalance || skipIfZeroBalance ? viewer?.accountId : undefined,
  });

  const isBalancePositive = useMemo(() => (token?.balanceFloat ?? 0) > 0, [token?.balanceFloat]);

  if (token !== undefined && (skipIfZeroBalance ? isBalancePositive : true)) {
    return (
      <SelectFieldOption value={tokenId} style={{ order: isBalancePositive ? 1 : undefined }}>
        <span className="inline-flex gap-2">
          <span>{token.metadata.symbol}</span>

          {showBalance && token.balanceFloat !== undefined && (
            <span className="text-muted-foreground selector-option-appendix">
              {`(${token.balanceFloat} available)`}
            </span>
          )}
        </span>
      </SelectFieldOption>
    );
  } else return null;
};

export type TokenSelectorProps = Pick<SelectFieldProps, "disabled"> &
  (ControlledSelectFieldProps | UncontrolledSelectFieldProps) & {
    hideBalances?: boolean;
    hideZeroBalanceOptions?: boolean;
  };

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  hideBalances = false,
  hideZeroBalanceOptions = false,
  ...props
}) => {
  const { data: tokenAllowlist } = useTokenAllowlist({
    enabled: FEATURE_REGISTRY.FtDonation.isEnabled,
  });

  return (
    // TODO: Move FormField wrapper from target parent layouts to here
    //* But do not forget to account for ability to use this component without forms

    <SelectField
      embedded
      label="Available tokens"
      classes={{
        trigger: "mr-2px h-full w-min rounded-r-none shadow-none",
      }}
      {...props}
    >
      <TokenSelectorOption tokenId={NATIVE_TOKEN_ID} showBalance={!hideBalances} />

      {tokenAllowlist.map((tokenAccountId) => (
        <TokenSelectorOption
          key={tokenAccountId}
          tokenId={tokenAccountId}
          showBalance={!hideBalances}
          skipIfZeroBalance={hideZeroBalanceOptions}
        />
      ))}
    </SelectField>
  );
};
