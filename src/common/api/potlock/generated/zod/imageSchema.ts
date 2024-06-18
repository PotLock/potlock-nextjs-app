import { z } from "zod";

import { nftSchema } from "./nftSchema";

export const imageSchema = z.object({
  url: z.coerce.string().url().optional(),
  ipfs_cid: z.coerce.string().optional(),
  nft: z.lazy(() => nftSchema).optional(),
});
