import { z } from "zod";
import { potPayoutSchema } from "./potPayoutSchema";


export const v1PotsPayoutsRetrievePathParamsSchema = z.object({ "pot_id": z.string() });
/**
 * @description Returns payouts for the pot
 */
export const v1PotsPayoutsRetrieve200Schema = z.array(z.lazy(() => potPayoutSchema));
/**
 * @description Pot not found
 */
export const v1PotsPayoutsRetrieve404Schema = z.any();
/**
 * @description Returns payouts for the pot
 */
export const v1PotsPayoutsRetrieveQueryResponseSchema = z.array(z.lazy(() => potPayoutSchema));