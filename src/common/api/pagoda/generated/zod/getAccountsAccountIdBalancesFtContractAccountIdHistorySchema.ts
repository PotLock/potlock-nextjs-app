import { z } from "zod";

import { ftHistoryResponseSchema } from "./ftHistoryResponseSchema";

export const getAccountsAccountIdBalancesFtContractAccountIdHistoryPathParamsSchema =
  z.object({
    account_id: z.coerce.string(),
    contract_account_id: z.coerce.string(),
  });

export const getAccountsAccountIdBalancesFtContractAccountIdHistoryQueryParamsSchema =
  z
    .object({
      after_event_index: z.coerce.string().optional(),
      limit: z.coerce
        .number()
        .describe("Maximum available limit 100")
        .optional(),
    })
    .optional();
/**
 * @description OK
 */
export const getAccountsAccountIdBalancesFtContractAccountIdHistory200Schema =
  z.lazy(() => ftHistoryResponseSchema);
/**
 * @description See the inner `code` value to get more details
 */
export const getAccountsAccountIdBalancesFtContractAccountIdHistory500Schema =
  z.any();
/**
 * @description OK
 */
export const getAccountsAccountIdBalancesFtContractAccountIdHistoryQueryResponseSchema =
  z.lazy(() => ftHistoryResponseSchema);
