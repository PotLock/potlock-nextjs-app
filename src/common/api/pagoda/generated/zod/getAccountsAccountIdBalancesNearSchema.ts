import { z } from "zod";

import { nearBalanceResponseSchema } from "./nearBalanceResponseSchema";

export const getAccountsAccountIdBalancesNearPathParamsSchema = z.object({
  account_id: z.coerce.string(),
});

export const getAccountsAccountIdBalancesNearQueryParamsSchema = z
  .object({
    block_height: z.coerce.string().optional(),
    block_timestamp_nanos: z.coerce.string().optional(),
  })
  .optional();
/**
 * @description OK
 */
export const getAccountsAccountIdBalancesNear200Schema = z.lazy(
  () => nearBalanceResponseSchema,
);
/**
 * @description See the inner `code` value to get more details
 */
export const getAccountsAccountIdBalancesNear500Schema = z.any();
/**
 * @description OK
 */
export const getAccountsAccountIdBalancesNearQueryResponseSchema = z.lazy(
  () => nearBalanceResponseSchema,
);
