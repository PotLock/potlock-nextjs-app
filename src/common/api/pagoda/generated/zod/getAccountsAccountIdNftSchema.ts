import { z } from "zod";

import { nftCountsResponseSchema } from "./nftCountsResponseSchema";

export const getAccountsAccountIdNftPathParamsSchema = z.object({
  account_id: z.coerce.string(),
});

export const getAccountsAccountIdNftQueryParamsSchema = z
  .object({ limit: z.coerce.number().optional() })
  .optional();
/**
 * @description OK
 */
export const getAccountsAccountIdNft200Schema = z.lazy(
  () => nftCountsResponseSchema,
);
/**
 * @description See the inner `code` value to get more details
 */
export const getAccountsAccountIdNft500Schema = z.any();
/**
 * @description OK
 */
export const getAccountsAccountIdNftQueryResponseSchema = z.lazy(
  () => nftCountsResponseSchema,
);
