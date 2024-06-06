import { v1StatsRetrieveQueryResponseSchema } from "../zod/v1StatsRetrieveSchema";
import useSWR from "swr";
import client from "@kubb/swagger-client/client";
import type { SWRConfiguration, SWRResponse } from "swr";
import type { V1StatsRetrieveQueryResponse, V1StatsRetrieve500 } from "../types/V1StatsRetrieve";

 type V1StatsRetrieveClient = typeof client<V1StatsRetrieveQueryResponse, V1StatsRetrieve500, never>;
type V1StatsRetrieve = {
    data: V1StatsRetrieveQueryResponse;
    error: V1StatsRetrieve500;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: V1StatsRetrieveQueryResponse;
    client: {
        parameters: Partial<Parameters<V1StatsRetrieveClient>[0]>;
        return: Awaited<ReturnType<V1StatsRetrieveClient>>;
    };
};
export function v1StatsRetrieveQueryOptions<TData = V1StatsRetrieve["response"]>(options: V1StatsRetrieve["client"]["parameters"] = {}): SWRConfiguration<TData, V1StatsRetrieve["error"]> {
    return {
        fetcher: async () => {
            const res = await client<TData, V1StatsRetrieve["error"]>({
                method: "get",
                url: `/api/v1/stats`,
                ...options
            });
            return v1StatsRetrieveQueryResponseSchema.parse(res.data);
        },
    };
}
/**
 * @link /api/v1/stats
 */
export function useV1StatsRetrieve<TData = V1StatsRetrieve["response"]>(options?: {
    query?: SWRConfiguration<TData, V1StatsRetrieve["error"]>;
    client?: V1StatsRetrieve["client"]["parameters"];
    shouldFetch?: boolean;
}): SWRResponse<TData, V1StatsRetrieve["error"]> {
    const { query: queryOptions, client: clientOptions = {}, shouldFetch = true } = options ?? {};
    const url = `/api/v1/stats`;
    const query = useSWR<TData, V1StatsRetrieve["error"], typeof url | null>(shouldFetch ? url : null, {
        ...v1StatsRetrieveQueryOptions<TData>(clientOptions),
        ...queryOptions
    });
    return query;
}