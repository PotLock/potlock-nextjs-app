import { z } from "zod";

import { ftBalancesResponseSchema } from "./ftBalancesResponseSchema";

export const getAccountsAccountIdBalancesFtPathParamsSchema = z.object({
  account_id: z.coerce.string(),
});

export const getAccountsAccountIdBalancesFtQueryParamsSchema = z
  .object({
    block_height: z.coerce.string().optional(),
    block_timestamp_nanos: z.coerce.string().optional(),
    limit: z.coerce.number().optional(),
  })
  .optional();
/**
 * @description OK
 */
export const getAccountsAccountIdBalancesFt200Schema = z.lazy(
  () => ftBalancesResponseSchema,
);
/**
 * @description See the inner `code` value to get more details
 */
export const getAccountsAccountIdBalancesFt500Schema = z.any();
/**
 * @description OK
 */
export const getAccountsAccountIdBalancesFtQueryResponseSchema = z.lazy(
  () => ftBalancesResponseSchema,
);
