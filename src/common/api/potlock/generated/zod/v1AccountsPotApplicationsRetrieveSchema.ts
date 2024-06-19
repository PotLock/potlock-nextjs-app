import { z } from "zod";

import { potApplicationSchema } from "./potApplicationSchema";

export const v1AccountsPotApplicationsRetrievePathParamsSchema = z.object({
  account_id: z.string(),
});
/**
 * @description Returns paginated pot applications for the account
 */
export const v1AccountsPotApplicationsRetrieve200Schema = z.array(
  z.lazy(() => potApplicationSchema),
);
/**
 * @description Invalid status value
 */
export const v1AccountsPotApplicationsRetrieve400Schema = z.any();
/**
 * @description Account not found
 */
export const v1AccountsPotApplicationsRetrieve404Schema = z.any();
/**
 * @description Internal server error
 */
export const v1AccountsPotApplicationsRetrieve500Schema = z.any();
/**
 * @description Returns paginated pot applications for the account
 */
export const v1AccountsPotApplicationsRetrieveQueryResponseSchema = z.array(
  z.lazy(() => potApplicationSchema),
);
