import { z } from "zod";

export const nftSchema = z.object({
  media: z.string().url().optional(),
  baseUri: z.string().url().optional(),
  tokenId: z.string().optional(),
  contractId: z.string().optional(),
});
