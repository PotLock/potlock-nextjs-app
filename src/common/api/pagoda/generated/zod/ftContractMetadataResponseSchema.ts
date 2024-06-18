import { z } from "zod";

export const ftContractMetadataResponseSchema = z.object({
  block_height: z.coerce.string(),
  block_timestamp_nanos: z.coerce.string(),
  metadata: z
    .object({
      decimals: z.coerce.number(),
      icon: z.coerce.string().optional(),
      name: z.coerce.string(),
      reference: z.coerce.string().optional(),
      reference_hash: z.coerce.string().optional(),
      spec: z.coerce.string(),
      symbol: z.coerce.string(),
    })
    .describe(
      "The type for FT Contract Metadata. Inspired by\n https://nomicon.io/Standards/Tokens/FungibleToken/Metadata",
    ),
});
