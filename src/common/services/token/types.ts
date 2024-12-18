import type { FungibleTokenMetadata } from "@/common/contracts/tokens";
import type { ByTokenId } from "@/common/types";

export type FtData = ByTokenId & {
  metadata: FungibleTokenMetadata;
  usdPrice?: Big.Big;
  balance?: Big.Big;
  balanceFloat?: number;
  balanceUsd?: Big.Big;
};
