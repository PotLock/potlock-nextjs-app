import { z } from "zod";

import { accountSchema } from "./accountSchema";

/**
 * @description Returns a list of accounts
 */
export const v1AccountsRetrieve200Schema = z.array(z.lazy(() => accountSchema));
/**
 * @description Internal server error
 */
export const v1AccountsRetrieve500Schema = z.any();
/**
 * @description Returns a list of accounts
 */
export const v1AccountsRetrieveQueryResponseSchema = z.array(
  z.lazy(() => accountSchema),
);
