import type { Donation } from "./Donation";

 export type V1PotsDonationsRetrievePathParams = {
    /**
     * @type string
    */
    pot_id: string;
};
/**
 * @description Returns donations for the pot
*/
export type V1PotsDonationsRetrieve200 = Donation[];
/**
 * @description Pot not found
*/
export type V1PotsDonationsRetrieve404 = any;
/**
 * @description Returns donations for the pot
*/
export type V1PotsDonationsRetrieveQueryResponse = Donation[];
export type V1PotsDonationsRetrieveQuery = {
    Response: V1PotsDonationsRetrieveQueryResponse;
    PathParams: V1PotsDonationsRetrievePathParams;
    Errors: V1PotsDonationsRetrieve404;
};