import { v1ListsRetrieveQueryResponseSchema } from "../zod/v1ListsRetrieveSchema";
import useSWR from "swr";
import client from "@kubb/swagger-client/client";
import type { SWRConfiguration, SWRResponse } from "swr";
import type { V1ListsRetrieveQueryResponse, V1ListsRetrieve500 } from "../types/V1ListsRetrieve";

 type V1ListsRetrieveClient = typeof client<V1ListsRetrieveQueryResponse, V1ListsRetrieve500, never>;
type V1ListsRetrieve = {
    data: V1ListsRetrieveQueryResponse;
    error: V1ListsRetrieve500;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: V1ListsRetrieveQueryResponse;
    client: {
        parameters: Partial<Parameters<V1ListsRetrieveClient>[0]>;
        return: Awaited<ReturnType<V1ListsRetrieveClient>>;
    };
};
export function v1ListsRetrieveQueryOptions<TData = V1ListsRetrieve["response"]>(options: V1ListsRetrieve["client"]["parameters"] = {}): SWRConfiguration<TData, V1ListsRetrieve["error"]> {
    return {
        fetcher: async () => {
            const res = await client<TData, V1ListsRetrieve["error"]>({
                method: "get",
                url: `/api/v1/lists`,
                ...options
            });
            return v1ListsRetrieveQueryResponseSchema.parse(res.data);
        },
    };
}
/**
 * @link /api/v1/lists
 */
export function useV1ListsRetrieve<TData = V1ListsRetrieve["response"]>(options?: {
    query?: SWRConfiguration<TData, V1ListsRetrieve["error"]>;
    client?: V1ListsRetrieve["client"]["parameters"];
    shouldFetch?: boolean;
}): SWRResponse<TData, V1ListsRetrieve["error"]> {
    const { query: queryOptions, client: clientOptions = {}, shouldFetch = true } = options ?? {};
    const url = `/api/v1/lists`;
    const query = useSWR<TData, V1ListsRetrieve["error"], typeof url | null>(shouldFetch ? url : null, {
        ...v1ListsRetrieveQueryOptions<TData>(clientOptions),
        ...queryOptions
    });
    return query;
}