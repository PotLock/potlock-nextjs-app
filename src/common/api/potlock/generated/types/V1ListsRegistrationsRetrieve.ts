import type { ListRegistration } from "./ListRegistration";

export type V1ListsRegistrationsRetrievePathParams = {
  /**
   * @type integer
   */
  list_id: number;
};
/**
 * @description Returns registrations for the list
 */
export type V1ListsRegistrationsRetrieve200 = ListRegistration[];
/**
 * @description List not found
 */
export type V1ListsRegistrationsRetrieve404 = any;
/**
 * @description Internal server error
 */
export type V1ListsRegistrationsRetrieve500 = any;
/**
 * @description Returns registrations for the list
 */
export type V1ListsRegistrationsRetrieveQueryResponse = ListRegistration[];
export type V1ListsRegistrationsRetrieveQuery = {
  Response: V1ListsRegistrationsRetrieveQueryResponse;
  PathParams: V1ListsRegistrationsRetrievePathParams;
  Errors: V1ListsRegistrationsRetrieve404 | V1ListsRegistrationsRetrieve500;
};
