import { z } from "zod";

export const metadataResponseSchema = z.object({
  block_height: z.coerce.string(),
  block_timestamp_nanos: z.coerce.string(),
  metadata: z
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
});
