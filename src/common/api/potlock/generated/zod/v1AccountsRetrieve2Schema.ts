import { z } from "zod";
import { accountSchema } from "./accountSchema";


export const v1AccountsRetrieve2PathParamsSchema = z.object({ "account_id": z.string() });
/**
 * @description Returns account details
 */
export const v1AccountsRetrieve2200Schema = z.lazy(() => accountSchema);
/**
 * @description Account not found
 */
export const v1AccountsRetrieve2404Schema = z.any();
/**
 * @description Internal server error
 */
export const v1AccountsRetrieve2500Schema = z.any();
/**
 * @description Returns account details
 */
export const v1AccountsRetrieve2QueryResponseSchema = z.lazy(() => accountSchema);