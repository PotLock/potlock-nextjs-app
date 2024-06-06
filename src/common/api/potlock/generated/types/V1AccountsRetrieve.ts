import type { Account } from "./Account";

 /**
 * @description Returns a list of accounts
*/
export type V1AccountsRetrieve200 = Account[];
/**
 * @description Internal server error
*/
export type V1AccountsRetrieve500 = any;
/**
 * @description Returns a list of accounts
*/
export type V1AccountsRetrieveQueryResponse = Account[];
export type V1AccountsRetrieveQuery = {
    Response: V1AccountsRetrieveQueryResponse;
    Errors: V1AccountsRetrieve500;
};