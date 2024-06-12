import { z } from "zod";

import { nftSchema } from "./nftSchema";

export const imageSchema = z.object({
  url: z.string().url().optional(),
  ipfs_cid: z.string().optional(),
  nft: z.lazy(() => nftSchema).optional(),
});
