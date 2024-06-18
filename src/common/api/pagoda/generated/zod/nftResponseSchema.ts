import { z } from "zod";

export const nftResponseSchema = z.object({
  block_height: z.coerce.string(),
  block_timestamp_nanos: z.coerce.string(),
  contract_metadata: z
    .object({
      base_uri: z.coerce.string().optional(),
      icon: z.coerce.string().optional(),
      name: z.coerce.string(),
      reference: z.coerce.string().optional(),
      reference_hash: z.coerce.string().optional(),
      spec: z.coerce.string(),
      symbol: z.coerce.string(),
    })
    .describe(
      "The type for Non Fungible Token Contract Metadata. Inspired by\n https://nomicon.io/Standards/Tokens/NonFungibleToken/Metadata",
    ),
  nft: z
    .object({
      metadata: z
        .object({
          copies: z.coerce.number().optional(),
          description: z.coerce.string().optional(),
          extra: z.coerce.string().optional(),
          media: z.coerce.string().optional(),
          media_hash: z.coerce.string().optional(),
          reference: z.coerce.string().optional(),
          reference_hash: z.coerce.string().optional(),
          title: z.coerce.string().optional(),
        })
        .describe(
          "The type for Non Fungible Token Metadata. Inspired by\n https://nomicon.io/Standards/Tokens/NonFungibleToken/Metadata",
        ),
      owner_account_id: z.coerce.string(),
      token_id: z.coerce.string(),
    })
    .describe(
      "The type for Non Fungible Token. Inspired by\n https://nomicon.io/Standards/Tokens/NonFungibleToken/Metadata",
    ),
});
