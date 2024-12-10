import { ByTokenId, FungibleTokenMetadata } from "@/common/types";

export type FtData = ByTokenId & {
  metadata: FungibleTokenMetadata;
  balance?: Big.Big;
  balanceFloat?: number;
  balanceUsd?: Big.Big;
  balanceUsdStringApproximation?: string;
  usdPrice?: Big.Big;
};
