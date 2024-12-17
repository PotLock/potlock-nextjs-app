import type { ByTokenId } from "@/common/types";

export type FungibleTokenMetadata = {
  spec: string;
  name: string;
  symbol: string;
  icon: string | null;
  reference: string | null;
  reference_hash: string | null;
  decimals: number;
};

export type FtData = ByTokenId & {
  metadata: FungibleTokenMetadata;
  balance?: Big.Big;
  balanceFloat?: number;
  balanceUsd?: Big.Big;
  balanceUsdStringApproximation?: string;
  usdPrice?: Big.Big;
};
