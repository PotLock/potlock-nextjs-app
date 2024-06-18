import { z } from "zod";

import { nftHistoryResponseSchema } from "./nftHistoryResponseSchema";

export const getNftContractAccountIdTokenIdHistoryPathParamsSchema = z.object({
  contract_account_id: z.coerce.string(),
  token_id: z.coerce.string(),
});

export const getNftContractAccountIdTokenIdHistoryQueryParamsSchema = z
  .object({ limit: z.coerce.number().optional() })
  .optional();
/**
 * @description OK
 */
export const getNftContractAccountIdTokenIdHistory200Schema = z.lazy(
  () => nftHistoryResponseSchema,
);
/**
 * @description See the inner `code` value to get more details
 */
export const getNftContractAccountIdTokenIdHistory500Schema = z.any();
/**
 * @description OK
 */
export const getNftContractAccountIdTokenIdHistoryQueryResponseSchema = z.lazy(
  () => nftHistoryResponseSchema,
);
