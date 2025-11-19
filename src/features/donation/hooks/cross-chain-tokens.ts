import useSWR from "swr";

import { IS_CLIENT } from "@/common/constants";

export interface CrossChainTokenData {
  symbol: string;
  blockchain: string;
  assetId: string;
  price: number;
  decimals: number;
  image?: string;
}

const TOKENS_API_URL = "https://1click.chaindefuser.com/v0/tokens";

const fetcher = async (): Promise<CrossChainTokenData[]> => {
  if (!IS_CLIENT) {
    return [];
  }

  const res = await fetch(TOKENS_API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch cross-chain tokens: ${res.status}`);
  }

  return res.json();
};

/**
 * Hook to fetch and cache cross-chain tokens using SWR
 * Tokens are cached and shared across components
 */
export const useCrossChainTokens = () => {
  return useSWR<CrossChainTokenData[]>(["cross-chain-tokens"], fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    // Cache for 5 minutes
    dedupingInterval: 5 * 60 * 1000,
  });
};

/**
 * Find a specific token by blockchain and assetId
 */
export const useCrossChainToken = (blockchain?: string, assetId?: string) => {
  const { data: tokens, ...rest } = useCrossChainTokens();

  const token = tokens?.find(
    (token) =>
      blockchain &&
      assetId &&
      token.assetId === assetId &&
      token.blockchain.toLowerCase() === blockchain.toLowerCase(),
  );

  return {
    ...rest,
    data: token,
    tokens,
  };
};
