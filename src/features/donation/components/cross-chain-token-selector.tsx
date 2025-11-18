import { useEffect, useMemo } from "react";

import { NATIVE_TOKEN_ID } from "@/common/constants";
import {
  type ControlledSelectFieldProps,
  SelectField,
  SelectFieldOption,
  type UncontrolledSelectFieldProps,
} from "@/common/ui/form/components";
import { useWalletUserSession } from "@/common/wallet";
import { useFungibleToken } from "@/entities/_shared/token/hooks/fungible";

import { type CrossChainTokenData, useCrossChainTokens } from "../hooks/cross-chain-tokens";

export type CrossChainTokenSelectorProps = Pick<
  React.ComponentPropsWithoutRef<typeof SelectField>,
  "disabled"
> &
  (ControlledSelectFieldProps | UncontrolledSelectFieldProps) & {
    onTokenChange?: (tokenId: string, blockchain: string, tokenData?: any) => void;
  };

export const CrossChainTokenSelector: React.FC<CrossChainTokenSelectorProps> = ({
  onTokenChange,
  ...props
}) => {
  const viewer = useWalletUserSession();

  // Use SWR hook to fetch and cache tokens
  const { data: tokens = [], isLoading: loading } = useCrossChainTokens();

  // Fetch NEAR balance for display
  const { data: nearToken } = useFungibleToken({
    tokenId: NATIVE_TOKEN_ID,
    balanceCheckAccountId: viewer?.accountId,
  });

  // Group tokens by blockchain and create options
  const tokenOptions = useMemo(() => {
    const options: Array<{
      value: string;
      label: string;
      blockchain: string;
      tokenData: CrossChainTokenData;
    }> = [];

    // Add NEAR first (balance is shown elsewhere, not in dropdown)
    options.push({
      value: NATIVE_TOKEN_ID,
      label: "NEAR",
      blockchain: "near",
      tokenData: {
        symbol: "NEAR",
        blockchain: "near",
        assetId: NATIVE_TOKEN_ID,
        price: 0,
        decimals: 24,
      },
    });

    // Add all other tokens from different chains (no balance shown since user isn't connected)
    tokens.forEach((token) => {
      if (
        token.symbol !== "wNEAR" &&
        token.symbol !== "TESTNEBULA" &&
        token.blockchain.toLowerCase() !== "near"
      ) {
        options.push({
          value: `${token.blockchain.toLowerCase()}:${token.assetId}`,
          label: `${token.symbol} (${token.blockchain.toUpperCase()})`,
          blockchain: token.blockchain.toLowerCase(),
          tokenData: token,
        });
      }
    });

    return options;
  }, [tokens, nearToken?.balanceFloat]);

  const handleValueChange = (value: string) => {
    const option = tokenOptions.find((opt) => opt.value === value);

    if (option && onTokenChange) {
      onTokenChange(value, option.blockchain, option.tokenData);
    }

    if ("onValueChange" in props && props.onValueChange) {
      props.onValueChange(value);
    }
  };

  // Call onTokenChange when component initializes with a defaultValue (e.g., when going back)
  useEffect(() => {
    if (!loading && tokens.length > 0 && onTokenChange) {
      const defaultValue =
        "defaultValue" in props ? props.defaultValue : "value" in props ? props.value : undefined;

      if (defaultValue && defaultValue !== NATIVE_TOKEN_ID && defaultValue.includes(":")) {
        const option = tokenOptions.find((opt) => opt.value === defaultValue);

        if (option) {
          onTokenChange(defaultValue, option.blockchain, option.tokenData);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, tokens.length, onTokenChange]);

  if (loading) {
    return (
      <SelectField
        embedded
        label="Available tokens"
        classes={{
          trigger: "mr-2px h-full w-min rounded-r-none shadow-none",
        }}
        disabled
        {...props}
      >
        <SelectFieldOption value="loading">Loading...</SelectFieldOption>
      </SelectField>
    );
  }

  return (
    <SelectField
      embedded
      label="Available tokens"
      classes={{
        trigger: "mr-2px h-full w-min rounded-r-none shadow-none",
      }}
      {...props}
      onValueChange={handleValueChange}
    >
      {tokenOptions.map((option) => (
        <SelectFieldOption key={option.value} value={option.value}>
          {option.label}
        </SelectFieldOption>
      ))}
    </SelectField>
  );
};
