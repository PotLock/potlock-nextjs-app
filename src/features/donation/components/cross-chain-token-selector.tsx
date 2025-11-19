import { useEffect, useMemo, useState } from "react";

import { Check, ChevronDown, Search } from "lucide-react";

import { NATIVE_TOKEN_ID } from "@/common/constants";
import {
  type ControlledSelectFieldProps,
  SelectField,
  SelectFieldOption,
  type UncontrolledSelectFieldProps,
} from "@/common/ui/form/components";
import { Popover, PopoverContent, PopoverTrigger } from "@/common/ui/layout/components";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/common/ui/layout/components/molecules/command";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import { useFungibleToken } from "@/entities/_shared/token/hooks/fungible";

import { type CrossChainTokenData, useCrossChainTokens } from "../hooks/cross-chain-tokens";

// Helper function to get token avatar image URL
const getTokenAvatarSrc = (blockchain?: string, tokenSymbol?: string): string => {
  const tokenAvatars: Array<{ src: string; name: string }> = [
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar.svg", name: "Sol" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(1).svg", name: "NEAR" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(2).svg", name: "USDC" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(3).svg", name: "Stellar" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(4).svg", name: "Base" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(5).svg", name: "Pol" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(6).svg", name: "Sui" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(7).svg", name: "Doge" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(8).svg", name: "Arb" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(9).svg", name: "Eth" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(10).svg", name: "Zec" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(11).svg", name: "BSC" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(12).svg", name: "XRP" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(13).svg", name: "Tron" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(14).svg", name: "USDT" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(15).svg", name: "Aurora" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(16).svg", name: "Aptos" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar17.png", name: "Avax" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar18.png", name: "Op" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar19.png", name: "Btc" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar20.png", name: "ton" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar21.png", name: "gnosis" },
    { src: "https://ik.imagekit.io/zjvk6l5gp/Avatar23.jpeg", name: "Bera" },
  ];

  const tokenAvatar = tokenSymbol
    ? tokenAvatars.find((a) => a.name.toLowerCase() === tokenSymbol.toLowerCase())
    : null;

  const blockchainAvatar = blockchain
    ? tokenAvatars.find((a) => a.name.toLowerCase() === blockchain.toLowerCase())
    : null;

  return (
    tokenAvatar?.src ||
    blockchainAvatar?.src ||
    "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar22.jpeg"
  );
};

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
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Use SWR hook to fetch and cache tokens
  const { data: tokens = [], isLoading: loading } = useCrossChainTokens();

  // Fetch NEAR balance for display
  const { data: nearToken } = useFungibleToken({
    tokenId: NATIVE_TOKEN_ID,
    balanceCheckAccountId: viewer?.accountId,
  });

  // Supported blockchains based on available addresses
  const supportedBlockchains = useMemo(() => {
    const nonEvmChains = ["btc", "zec", "ton", "doge", "sol", "near", "xrp", "sui"];

    const evmChains = [
      "evm",
      "eth",
      "arb",
      "arbitrum",
      "gnosis",
      "base",
      "bera",
      "pol",
      "tron",
      "avax",
      "op",
    ];

    return new Set([...nonEvmChains, ...evmChains].map((chain) => chain.toLowerCase()));
  }, []);

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
    // Only include tokens from supported blockchains
    tokens.forEach((token) => {
      const normalizedBlockchain = token.blockchain.toLowerCase();

      // Check if blockchain is supported (handle variations like "ethereum" -> "eth", "arbitrum" -> "arb")
      let isSupported = supportedBlockchains.has(normalizedBlockchain);

      if (!isSupported) {
        // Handle common variations
        const blockchainVariations: Record<string, string[]> = {
          ethereum: ["eth", "evm"],
          arbitrum: ["arb", "arbitrum"],
          optimism: ["op"],
          avalanche: ["avax"],
          polygon: ["pol"],
          gnosis: ["gnosis"],
          base: ["base"],
          tron: ["tron"],
          bsc: ["evm"], // BSC is EVM-compatible
        };

        const variations = blockchainVariations[normalizedBlockchain];

        if (variations) {
          isSupported = variations.some((variant) => supportedBlockchains.has(variant));
        }
      }

      if (
        token.symbol !== "wNEAR" &&
        token.symbol !== "TESTNEBULA" &&
        normalizedBlockchain !== "near" &&
        isSupported
      ) {
        options.push({
          value: `${normalizedBlockchain}:${token.assetId}`,
          label: `${token.symbol} (${token.blockchain.toUpperCase()})`,
          blockchain: normalizedBlockchain,
          tokenData: token,
        });
      }
    });

    return options;
  }, [tokens, nearToken?.balanceFloat, supportedBlockchains]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return tokenOptions;
    const query = searchQuery.toLowerCase();
    return tokenOptions.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        option.tokenData.symbol.toLowerCase().includes(query) ||
        option.blockchain.toLowerCase().includes(query),
    );
  }, [tokenOptions, searchQuery]);

  // Get current selected value
  const currentValue =
    "defaultValue" in props ? props.defaultValue : "value" in props ? props.value : undefined;

  const selectedOption = tokenOptions.find((opt) => opt.value === currentValue);

  const handleValueChange = (value: string) => {
    const option = tokenOptions.find((opt) => opt.value === value);

    if (option && onTokenChange) {
      onTokenChange(value, option.blockchain, option.tokenData);
    }

    if ("onValueChange" in props && props.onValueChange) {
      props.onValueChange(value);
    }

    setOpen(false);
    setSearchQuery("");
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={props.disabled}
          className={cn(
            "bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring mr-2px flex h-full min-w-[140px] items-center justify-between gap-2 rounded-r-none py-2 pl-3 pr-2 text-sm shadow-[0px_0px_0px_1px_#00000038_inset,0px_-1px_1px_0px_#00000038_inset] focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
            props.disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <span className="line-clamp-1 flex items-center gap-2">
            {selectedOption ? (
              <>
                <img
                  src={getTokenAvatarSrc(
                    selectedOption.blockchain,
                    selectedOption.tokenData.symbol,
                  )}
                  alt={selectedOption.tokenData.symbol}
                  className="h-5 w-5 rounded-full object-cover"
                />
                <span className="text-sm">{selectedOption.tokenData.symbol}</span>
              </>
            ) : (
              <span className="text-muted-foreground">Select token</span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[300px] p-0"
        align="start"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <Command className="!overflow-visible" shouldFilter={false}>
          <CommandInput
            placeholder="Search tokens..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList
            className="max-h-[300px] overflow-y-auto overflow-x-hidden"
            onWheel={(e) => {
              // Allow scrolling to work
              e.stopPropagation();
            }}
          >
            <CommandEmpty>No tokens found.</CommandEmpty>
            {filteredOptions.length === 0 ? null : (
              <CommandGroup className="!overflow-visible">
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      handleValueChange(option.value);
                    }}
                    className="!pointer-events-auto flex !cursor-pointer items-center gap-2 opacity-100 hover:bg-[#FEF6EE] hover:opacity-100 aria-selected:bg-[#FEF6EE] data-[disabled]:pointer-events-auto data-[disabled]:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleValueChange(option.value);
                    }}
                  >
                    <img
                      src={getTokenAvatarSrc(option.blockchain, option.tokenData.symbol)}
                      alt={option.tokenData.symbol}
                      className="pointer-events-none h-5 w-5 shrink-0 rounded-full object-cover"
                    />
                    <span className="pointer-events-none flex-1">{option.label}</span>
                    {currentValue === option.value && (
                      <Check className="pointer-events-none h-4 w-4 shrink-0 text-green-500" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
