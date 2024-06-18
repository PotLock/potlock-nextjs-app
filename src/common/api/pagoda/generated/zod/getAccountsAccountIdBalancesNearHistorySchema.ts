import { z } from "zod";

import { nearHistoryResponseSchema } from "./nearHistoryResponseSchema";

export const getAccountsAccountIdBalancesNearHistoryPathParamsSchema = z.object(
  { account_id: z.coerce.string() },
);

export const getAccountsAccountIdBalancesNearHistoryQueryParamsSchema = z
  .object({
    after_event_index: z.coerce.string().optional(),
    limit: z.coerce.number().describe("Maximum available limit 100").optional(),
  })
  .optional();
/**
 * @description OK
 */
export const getAccountsAccountIdBalancesNearHistory200Schema = z.lazy(
  () => nearHistoryResponseSchema,
);
/**
 * @description See the inner `code` value to get more details
 */
export const getAccountsAccountIdBalancesNearHistory500Schema = z.any();
/**
 * @description OK
 */
export const getAccountsAccountIdBalancesNearHistoryQueryResponseSchema =
  z.lazy(() => nearHistoryResponseSchema);
