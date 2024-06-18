import { z } from "zod";

import { ftContractMetadataResponseSchema } from "./ftContractMetadataResponseSchema";

export const getNep141MetadataContractAccountIdPathParamsSchema = z.object({
  contract_account_id: z.coerce.string(),
});

export const getNep141MetadataContractAccountIdQueryParamsSchema = z
  .object({
    block_height: z.coerce.string().optional(),
    block_timestamp_nanos: z.coerce.string().optional(),
  })
  .optional();
/**
 * @description OK
 */
export const getNep141MetadataContractAccountId200Schema = z.lazy(
  () => ftContractMetadataResponseSchema,
);
/**
 * @description See the inner `code` value to get more details
 */
export const getNep141MetadataContractAccountId500Schema = z.any();
/**
 * @description OK
 */
export const getNep141MetadataContractAccountIdQueryResponseSchema = z.lazy(
  () => ftContractMetadataResponseSchema,
);
