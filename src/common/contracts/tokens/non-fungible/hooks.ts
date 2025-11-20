import useSWR from "swr";

import { CONTRACT_SWR_CONFIG, IS_CLIENT } from "@/common/constants";
import type { ConditionalActivation } from "@/common/types";

import * as nftContractClient from "./client";
import type { NonFungibleTokenLookupParams } from "./interfaces";

export const useToken = ({
  enabled = true,
  contractAccountId,
  tokenId,
}: NonFungibleTokenLookupParams & ConditionalActivation) =>
  useSWR(
    () => (enabled ? ["nftContractClient.nft_token", contractAccountId, tokenId] : null),

    ([_queryKeyHead, account_id, token_id]) =>
      IS_CLIENT
        ? nftContractClient
            .nft_token({ contractAccountId: account_id, tokenId: token_id })
            .catch(() => undefined)
        : undefined,

    CONTRACT_SWR_CONFIG,
  );
