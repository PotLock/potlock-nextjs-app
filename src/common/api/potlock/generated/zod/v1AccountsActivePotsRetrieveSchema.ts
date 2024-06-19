import { z } from "zod";

import { potSchema } from "./potSchema";

export const v1AccountsActivePotsRetrievePathParamsSchema = z.object({
  account_id: z.string(),
});

export const v1AccountsActivePotsRetrieveQueryParamsSchema = z
  .object({ status: z.string().describe("Filter by pot status").optional() })
  .optional();
/**
 * @description Returns paginated active pots for the account
 */
export const v1AccountsActivePotsRetrieve200Schema = z.array(
  z.lazy(() => potSchema),
);
/**
 * @description Account not found
 */
export const v1AccountsActivePotsRetrieve404Schema = z.any();
/**
 * @description Internal server error
 */
export const v1AccountsActivePotsRetrieve500Schema = z.any();
/**
 * @description Returns paginated active pots for the account
 */
export const v1AccountsActivePotsRetrieveQueryResponseSchema = z.array(
  z.lazy(() => potSchema),
);
