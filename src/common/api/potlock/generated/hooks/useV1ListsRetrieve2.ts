import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  V1ListsRetrieve2404,
  V1ListsRetrieve2500,
  V1ListsRetrieve2PathParams,
  V1ListsRetrieve2QueryResponse,
} from "../types/V1ListsRetrieve2";
import { v1ListsRetrieve2QueryResponseSchema } from "../zod/v1ListsRetrieve2Schema";

type V1ListsRetrieve2Client = typeof client<
  V1ListsRetrieve2QueryResponse,
  V1ListsRetrieve2404 | V1ListsRetrieve2500,
  never
>;
type V1ListsRetrieve2 = {
  data: V1ListsRetrieve2QueryResponse;
  error: V1ListsRetrieve2404 | V1ListsRetrieve2500;
  request: never;
  pathParams: V1ListsRetrieve2PathParams;
  queryParams: never;
  headerParams: never;
  response: V1ListsRetrieve2QueryResponse;
  client: {
    parameters: Partial<Parameters<V1ListsRetrieve2Client>[0]>;
    return: Awaited<ReturnType<V1ListsRetrieve2Client>>;
  };
};
export function v1ListsRetrieve2QueryOptions<
  TData = V1ListsRetrieve2["response"],
>(
  listId: V1ListsRetrieve2PathParams["list_id"],
  options: V1ListsRetrieve2["client"]["parameters"] = {},
): SWRConfiguration<TData, V1ListsRetrieve2["error"]> {
  return {
    fetcher: async () => {
      const res = await client<TData, V1ListsRetrieve2["error"]>({
        method: "get",
        url: `/api/v1/lists/${listId}`,
        ...options,
      });
      return v1ListsRetrieve2QueryResponseSchema.parse(res.data);
    },
  };
}
/**
 * @link /api/v1/lists/:list_id
 */
export function useV1ListsRetrieve2<TData = V1ListsRetrieve2["response"]>(
  listId: V1ListsRetrieve2PathParams["list_id"],
  options?: {
    query?: SWRConfiguration<TData, V1ListsRetrieve2["error"]>;
    client?: V1ListsRetrieve2["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, V1ListsRetrieve2["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/api/v1/lists/${listId}`;
  const query = useSWR<TData, V1ListsRetrieve2["error"], typeof url | null>(
    shouldFetch ? url : null,
    {
      ...v1ListsRetrieve2QueryOptions<TData>(listId, clientOptions),
      ...queryOptions,
    },
  );
  return query;
}
