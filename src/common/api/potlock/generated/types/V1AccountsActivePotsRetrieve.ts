import type { Pot } from "./Pot";

 export type V1AccountsActivePotsRetrievePathParams = {
    /**
     * @type string
    */
    account_id: string;
};
export type V1AccountsActivePotsRetrieveQueryParams = {
    /**
     * @description Filter by pot status
     * @type string | undefined
    */
    status?: string;
};
/**
 * @description Returns paginated active pots for the account
*/
export type V1AccountsActivePotsRetrieve200 = Pot[];
/**
 * @description Account not found
*/
export type V1AccountsActivePotsRetrieve404 = any;
/**
 * @description Internal server error
*/
export type V1AccountsActivePotsRetrieve500 = any;
/**
 * @description Returns paginated active pots for the account
*/
export type V1AccountsActivePotsRetrieveQueryResponse = Pot[];
export type V1AccountsActivePotsRetrieveQuery = {
    Response: V1AccountsActivePotsRetrieveQueryResponse;
    PathParams: V1AccountsActivePotsRetrievePathParams;
    QueryParams: V1AccountsActivePotsRetrieveQueryParams;
    Errors: V1AccountsActivePotsRetrieve404 | V1AccountsActivePotsRetrieve500;
};