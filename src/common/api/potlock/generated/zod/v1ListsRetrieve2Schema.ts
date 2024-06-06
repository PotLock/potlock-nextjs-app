import { z } from "zod";
import { listSchema } from "./listSchema";


export const v1ListsRetrieve2PathParamsSchema = z.object({ "list_id": z.number() });
/**
 * @description Returns list details
 */
export const v1ListsRetrieve2200Schema = z.lazy(() => listSchema);
/**
 * @description List not found
 */
export const v1ListsRetrieve2404Schema = z.any();
/**
 * @description Internal server error
 */
export const v1ListsRetrieve2500Schema = z.any();
/**
 * @description Returns list details
 */
export const v1ListsRetrieve2QueryResponseSchema = z.lazy(() => listSchema);