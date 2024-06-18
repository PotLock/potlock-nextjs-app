import { z } from "zod";

import { nftsResponseSchema } from "./nftsResponseSchema";

export const getAccountsAccountIdNftContractAccountIdPathParamsSchema =
  z.object({
    account_id: z.coerce.string(),
    contract_account_id: z.coerce.string(),
  });

export const getAccountsAccountIdNftContractAccountIdQueryParamsSchema = z
  .object({ limit: z.coerce.number().optional() })
  .optional();
/**
 * @description OK
 */
export const getAccountsAccountIdNftContractAccountId200Schema = z.lazy(
  () => nftsResponseSchema,
);
/**
 * @description See the inner `code` value to get more details
 */
export const getAccountsAccountIdNftContractAccountId500Schema = z.any();
/**
 * @description OK
 */
export const getAccountsAccountIdNftContractAccountIdQueryResponseSchema =
  z.lazy(() => nftsResponseSchema);
