import type { NativeTokenMetadata } from "@/common/blockchains/near-protocol/hooks";
import type { FungibleTokenMetadata } from "@/common/contracts/tokens";
import type { AccountId, ByTokenId } from "@/common/types";

export type TokenData = ByTokenId & {
  metadata: NativeTokenMetadata | FungibleTokenMetadata;
  usdPrice?: Big.Big;
  balance?: Big.Big;
  balanceFloat?: number;
  balanceUsd?: Big.Big;
};

export interface TokenQuery extends ByTokenId {
  balanceCheckAccountId?: AccountId;
}

export type TokenQueryResult = {
  isMetadataLoading: boolean;
  isUsdPriceLoading: boolean;
  isBalanceLoading: boolean;
  isLoading: boolean;
  data?: TokenData;
  error?: Error;
};

export type TokenAvailableBalance = {
  isBalanceLoading: boolean;
  balanceFloat: number | null;
  balanceString: string | null;
};
