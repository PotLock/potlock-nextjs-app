import { z } from "zod";

import { nftResponseSchema } from "./nftResponseSchema";

export const getNftContractAccountIdTokenIdPathParamsSchema = z.object({
  contract_account_id: z.coerce.string(),
  token_id: z.coerce.string(),
});

export const getNftContractAccountIdTokenIdQueryParamsSchema = z
  .object({
    block_height: z.coerce.string().optional(),
    block_timestamp_nanos: z.coerce.string().optional(),
  })
  .optional();
/**
 * @description OK
 */
export const getNftContractAccountIdTokenId200Schema = z.lazy(
  () => nftResponseSchema,
);
/**
 * @description See the inner `code` value to get more details
 */
export const getNftContractAccountIdTokenId500Schema = z.any();
/**
 * @description OK
 */
export const getNftContractAccountIdTokenIdQueryResponseSchema = z.lazy(
  () => nftResponseSchema,
);
