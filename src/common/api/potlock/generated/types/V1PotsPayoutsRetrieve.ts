import type { PotPayout } from "./PotPayout";

 export type V1PotsPayoutsRetrievePathParams = {
    /**
     * @type string
    */
    pot_id: string;
};
/**
 * @description Returns payouts for the pot
*/
export type V1PotsPayoutsRetrieve200 = PotPayout[];
/**
 * @description Pot not found
*/
export type V1PotsPayoutsRetrieve404 = any;
/**
 * @description Returns payouts for the pot
*/
export type V1PotsPayoutsRetrieveQueryResponse = PotPayout[];
export type V1PotsPayoutsRetrieveQuery = {
    Response: V1PotsPayoutsRetrieveQueryResponse;
    PathParams: V1PotsPayoutsRetrievePathParams;
    Errors: V1PotsPayoutsRetrieve404;
};