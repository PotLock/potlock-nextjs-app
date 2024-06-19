import { z } from "zod";

import { listRegistrationSchema } from "./listRegistrationSchema";

export const v1ListsRegistrationsRetrievePathParamsSchema = z.object({
  list_id: z.number(),
});
/**
 * @description Returns registrations for the list
 */
export const v1ListsRegistrationsRetrieve200Schema = z.array(
  z.lazy(() => listRegistrationSchema),
);
/**
 * @description List not found
 */
export const v1ListsRegistrationsRetrieve404Schema = z.any();
/**
 * @description Internal server error
 */
export const v1ListsRegistrationsRetrieve500Schema = z.any();
/**
 * @description Returns registrations for the list
 */
export const v1ListsRegistrationsRetrieveQueryResponseSchema = z.array(
  z.lazy(() => listRegistrationSchema),
);
