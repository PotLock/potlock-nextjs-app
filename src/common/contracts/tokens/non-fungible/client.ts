import { nearProtocolClient } from "@/common/blockchains/near-protocol";
import type { ByContractAccountId } from "@/common/types";

import type {
  NonFungibleToken,
  NonFungibleTokenContractMetadata,
  NonFungibleTokenLookupParams,
} from "./interfaces";

export type NftTokenArgs = {
  token_id: string;
};

/**
 * Returns NFT by token id from the given contract, if it exists.
 */
export const nft_token = ({ contractAccountId, tokenId }: NonFungibleTokenLookupParams) =>
  nearProtocolClient.naxiosInstance
    .contractApi({ contractId: contractAccountId })
    .view<NftTokenArgs, NonFungibleToken>("nft_token", { args: { token_id: tokenId } })
    .catch(() => undefined);

/**
 * Returns NFT contract metadata.
 */
export const nft_metadata = ({ contractAccountId }: ByContractAccountId) =>
  nearProtocolClient.naxiosInstance
    .contractApi({ contractId: contractAccountId })
    .view<{}, NonFungibleTokenContractMetadata>("nft_metadata")
    .catch(() => undefined);
