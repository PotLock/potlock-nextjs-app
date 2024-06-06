import { z } from "zod";
import { accountSchema } from "./accountSchema";


export const v1PotsSponsorsRetrievePathParamsSchema = z.object({ "pot_id": z.string() });
/**
 * @description Returns sponsors for the pot
 */
export const v1PotsSponsorsRetrieve200Schema = z.array(z.lazy(() => accountSchema));
/**
 * @description Pot not found
 */
export const v1PotsSponsorsRetrieve404Schema = z.any();
/**
 * @description Returns sponsors for the pot
 */
export const v1PotsSponsorsRetrieveQueryResponseSchema = z.array(z.lazy(() => accountSchema));