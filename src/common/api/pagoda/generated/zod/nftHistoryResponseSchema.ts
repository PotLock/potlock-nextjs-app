import { z } from "zod";

export const nftHistoryResponseSchema = z.object({
  block_height: z.coerce.string(),
  block_timestamp_nanos: z.coerce.string(),
  history: z.array(
    z
      .object({
        block_height: z.coerce.string(),
        block_timestamp_nanos: z.coerce.string(),
        cause: z.coerce.string(),
        new_account_id: z.coerce.string().optional(),
        old_account_id: z.coerce.string().optional(),
        status: z.coerce.string(),
      })
      .describe(
        'This type describes the history of NFT movements.\n Note, it\'s not attached to any user, it\'s the whole history of NFT movements.\n `cause` is one of ["mint", "transfer", "burn"]',
      ),
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
