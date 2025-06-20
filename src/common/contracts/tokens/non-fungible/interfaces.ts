import type { AccountId } from "@/common/types";

/**
 * https://nomicon.io/Standards/Tokens/NonFungibleToken/Metadata#interface
 */
export type NonFungibleTokenMetadata = {
  /**
   * e.g. "Arch Nemesis: Mail Carrier" or "Parcel #5055"
   */
  title: string | null;

  /**
   * Free-form description
   */
  description: string | null;

  /**
   * A URI pointing to the associated media, preferably to decentralized, content-addressed storage
   */
  media: string | null;

  /**
   * Base64-encoded sha256 hash of content referenced by the `media` field
   */
  media_hash: string | null;

  /**
   * Number of copies of this set of metadata in existence when token was minted
   */
  copies: number | null;

  /**
   * When token was issued or minted, Unix epoch in milliseconds
   */
  issued_at: number | null;

  /**
   * When token expires, Unix epoch in milliseconds
   */
  expires_at: number | null;

  /**
   * When token starts being valid, Unix epoch in milliseconds
   */
  starts_at: number | null;

  /**
   * When token was last updated, Unix epoch in milliseconds
   */
  updated_at: number | null;

  /**
   * Anything extra the NFT wants to store on-chain. Can be stringified JSON
   */
  extra: string | null;

  /**
   * URL to an off-chain JSON file with more info
   */
  reference: string | null;

  /**
   * Base64-encoded sha256 hash of JSON from reference field
   */
  reference_hash: string | null;
};

/**
 * https://nomicon.io/Standards/Tokens/NonFungibleToken/Metadata#interface
 */
export type NonFungibleTokenContractMetadata = {
  /**
   * Essentially a version like "nft-2.0.0",
   * replacing "2.0.0" with the implemented version of NEP-177
   */
  spec: string;

  /**
   * e.g. "Mochi Rising — Digital Edition" or "Metaverse 3"
   */
  name: string;

  /**
   * e.g. "MOCHI"
   */
  symbol: string;

  /**
   * Data URL
   */
  icon: string | null;

  /**
   * Centralized gateway known to have reliable access to decentralized storage assets
   * referenced by `reference` or `media` URLs
   */
  base_uri: string | null;

  /**
   * URL to a JSON file with more info
   */
  reference: string | null;

  /**
   * Base64-encoded sha256 hash of JSON from reference field. Required if `reference` is included.
   */
  reference_hash: string | null;
};

export type NonFungibleToken = {
  token_id: string;
  owner_id: AccountId;
  metadata: NonFungibleTokenMetadata;
};

export type NonFungibleTokenLookupParams = {
  contractAccountId: AccountId;
  tokenId: NonFungibleToken["token_id"];
};
