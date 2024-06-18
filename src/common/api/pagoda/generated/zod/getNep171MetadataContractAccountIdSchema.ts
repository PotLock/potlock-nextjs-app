import { z } from "zod";

import { metadataResponseSchema } from "./metadataResponseSchema";

export const getNep171MetadataContractAccountIdPathParamsSchema = z.object({
  contract_account_id: z.coerce.string(),
});

export const getNep171MetadataContractAccountIdQueryParamsSchema = z
  .object({
    block_height: z.coerce.string().optional(),
    block_timestamp_nanos: z.coerce.string().optional(),
  })
  .optional();
/**
 * @description OK
 */
export const getNep171MetadataContractAccountId200Schema = z.lazy(
  () => metadataResponseSchema,
);
/**
 * @description See the inner `code` value to get more details
 */
export const getNep171MetadataContractAccountId500Schema = z.any();
/**
 * @description OK
 */
export const getNep171MetadataContractAccountIdQueryResponseSchema = z.lazy(
  () => metadataResponseSchema,
);
