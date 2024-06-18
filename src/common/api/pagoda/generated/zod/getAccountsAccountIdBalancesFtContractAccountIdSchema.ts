import { z } from "zod";

import { ftBalanceByContractResponseSchema } from "./ftBalanceByContractResponseSchema";

export const getAccountsAccountIdBalancesFtContractAccountIdPathParamsSchema =
  z.object({
    account_id: z.coerce.string(),
    contract_account_id: z.coerce.string(),
  });

export const getAccountsAccountIdBalancesFtContractAccountIdQueryParamsSchema =
  z
    .object({
      block_height: z.coerce.string().optional(),
      block_timestamp_nanos: z.coerce.string().optional(),
    })
    .optional();
/**
 * @description OK
 */
export const getAccountsAccountIdBalancesFtContractAccountId200Schema = z.lazy(
  () => ftBalanceByContractResponseSchema,
);
/**
 * @description See the inner `code` value to get more details
 */
export const getAccountsAccountIdBalancesFtContractAccountId500Schema = z.any();
/**
 * @description OK
 */
export const getAccountsAccountIdBalancesFtContractAccountIdQueryResponseSchema =
  z.lazy(() => ftBalanceByContractResponseSchema);
