import type { List } from "./List";

/**
 * @description Returns a paginated list of lists
 */
export type V1ListsRetrieve200 = List[];
/**
 * @description Internal server error
 */
export type V1ListsRetrieve500 = any;
/**
 * @description Returns a paginated list of lists
 */
export type V1ListsRetrieveQueryResponse = List[];
export type V1ListsRetrieveQuery = {
  Response: V1ListsRetrieveQueryResponse;
  Errors: V1ListsRetrieve500;
};
