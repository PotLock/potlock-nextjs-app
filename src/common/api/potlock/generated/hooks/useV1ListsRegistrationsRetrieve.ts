import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  V1ListsRegistrationsRetrieve404,
  V1ListsRegistrationsRetrieve500,
  V1ListsRegistrationsRetrievePathParams,
  V1ListsRegistrationsRetrieveQueryResponse,
} from "../types/V1ListsRegistrationsRetrieve";
import { v1ListsRegistrationsRetrieveQueryResponseSchema } from "../zod/v1ListsRegistrationsRetrieveSchema";

type V1ListsRegistrationsRetrieveClient = typeof client<
  V1ListsRegistrationsRetrieveQueryResponse,
  V1ListsRegistrationsRetrieve404 | V1ListsRegistrationsRetrieve500,
  never
>;
type V1ListsRegistrationsRetrieve = {
  data: V1ListsRegistrationsRetrieveQueryResponse;
  error: V1ListsRegistrationsRetrieve404 | V1ListsRegistrationsRetrieve500;
  request: never;
  pathParams: V1ListsRegistrationsRetrievePathParams;
  queryParams: never;
  headerParams: never;
  response: V1ListsRegistrationsRetrieveQueryResponse;
  client: {
    parameters: Partial<Parameters<V1ListsRegistrationsRetrieveClient>[0]>;
    return: Awaited<ReturnType<V1ListsRegistrationsRetrieveClient>>;
  };
};
export function v1ListsRegistrationsRetrieveQueryOptions<
  TData = V1ListsRegistrationsRetrieve["response"],
>(
  listId: V1ListsRegistrationsRetrievePathParams["list_id"],
  options: V1ListsRegistrationsRetrieve["client"]["parameters"] = {},
): SWRConfiguration<TData, V1ListsRegistrationsRetrieve["error"]> {
  return {
    fetcher: async () => {
      const res = await client<TData, V1ListsRegistrationsRetrieve["error"]>({
        method: "get",
        url: `/api/v1/lists/${listId}/registrations`,
        ...options,
      });
      return v1ListsRegistrationsRetrieveQueryResponseSchema.parse(res.data);
    },
  };
}
/**
 * @link /api/v1/lists/:list_id/registrations
 */
export function useV1ListsRegistrationsRetrieve<
  TData = V1ListsRegistrationsRetrieve["response"],
>(
  listId: V1ListsRegistrationsRetrievePathParams["list_id"],
  options?: {
    query?: SWRConfiguration<TData, V1ListsRegistrationsRetrieve["error"]>;
    client?: V1ListsRegistrationsRetrieve["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, V1ListsRegistrationsRetrieve["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/api/v1/lists/${listId}/registrations`;
  const query = useSWR<
    TData,
    V1ListsRegistrationsRetrieve["error"],
    typeof url | null
  >(shouldFetch ? url : null, {
    ...v1ListsRegistrationsRetrieveQueryOptions<TData>(listId, clientOptions),
    ...queryOptions,
  });
  return query;
}
