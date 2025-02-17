import { naxiosInstance } from "@/common/blockchains/near-protocol/client";
import type { AccountId, ByAccountId, ByTokenId } from "@/common/types";

import type { FungibleTokenMetadata } from "./interfaces";

export const ft_metadata = ({ tokenId }: ByTokenId) =>
  naxiosInstance
    .contractApi({ contractId: tokenId })
    .view<{}, FungibleTokenMetadata>("ft_metadata")
    .catch(() => undefined);

export const ft_balance_of = ({ accountId, tokenId }: ByAccountId & ByTokenId) =>
  naxiosInstance
    .contractApi({ contractId: tokenId })
    .view<{ account_id: AccountId }, string>("ft_balance_of", {
      args: { account_id: accountId },
    })
    .catch(() => undefined);
