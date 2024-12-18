import type { NativeTokenMetadata } from "@/common/api/near/hooks";
import type { FungibleTokenMetadata } from "@/common/contracts/tokens";
import type { ByTokenId } from "@/common/types";

export type TokenData = ByTokenId & {
  metadata: NativeTokenMetadata | FungibleTokenMetadata;
  usdPrice?: Big.Big;
  balance?: Big.Big;
  balanceFloat?: number;
  balanceUsd?: Big.Big;
};
