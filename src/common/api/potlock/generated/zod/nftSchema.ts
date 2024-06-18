import { z } from "zod";

export const nftSchema = z.object({
  media: z.coerce.string().url().optional(),
  baseUri: z.coerce.string().url().optional(),
  tokenId: z.coerce.string().optional(),
  contractId: z.coerce.string().optional(),
});
