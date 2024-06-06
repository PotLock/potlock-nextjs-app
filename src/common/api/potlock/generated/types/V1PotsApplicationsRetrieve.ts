import type { PotApplication } from "./PotApplication";

 export type V1PotsApplicationsRetrievePathParams = {
    /**
     * @type string
    */
    pot_id: string;
};
/**
 * @description Returns applications for the pot
*/
export type V1PotsApplicationsRetrieve200 = PotApplication[];
/**
 * @description Pot not found
*/
export type V1PotsApplicationsRetrieve404 = any;
/**
 * @description Returns applications for the pot
*/
export type V1PotsApplicationsRetrieveQueryResponse = PotApplication[];
export type V1PotsApplicationsRetrieveQuery = {
    Response: V1PotsApplicationsRetrieveQueryResponse;
    PathParams: V1PotsApplicationsRetrievePathParams;
    Errors: V1PotsApplicationsRetrieve404;
};