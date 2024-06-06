import { v1PotsRetrieveQueryResponseSchema } from "../zod/v1PotsRetrieveSchema";
import useSWR from "swr";
import client from "@kubb/swagger-client/client";
import type { SWRConfiguration, SWRResponse } from "swr";
import type { V1PotsRetrieveQueryResponse } from "../types/V1PotsRetrieve";

 type V1PotsRetrieveClient = typeof client<V1PotsRetrieveQueryResponse, never, never>;
type V1PotsRetrieve = {
    data: V1PotsRetrieveQueryResponse;
    error: never;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: V1PotsRetrieveQueryResponse;
    client: {
        parameters: Partial<Parameters<V1PotsRetrieveClient>[0]>;
        return: Awaited<ReturnType<V1PotsRetrieveClient>>;
    };
};
export function v1PotsRetrieveQueryOptions<TData = V1PotsRetrieve["response"]>(options: V1PotsRetrieve["client"]["parameters"] = {}): SWRConfiguration<TData, V1PotsRetrieve["error"]> {
    return {
        fetcher: async () => {
            const res = await client<TData, V1PotsRetrieve["error"]>({
                method: "get",
                url: `/api/v1/pots`,
                ...options
            });
            return v1PotsRetrieveQueryResponseSchema.parse(res.data);
        },
    };
}
/**
 * @link /api/v1/pots
 */
export function useV1PotsRetrieve<TData = V1PotsRetrieve["response"]>(options?: {
    query?: SWRConfiguration<TData, V1PotsRetrieve["error"]>;
    client?: V1PotsRetrieve["client"]["parameters"];
    shouldFetch?: boolean;
}): SWRResponse<TData, V1PotsRetrieve["error"]> {
    const { query: queryOptions, client: clientOptions = {}, shouldFetch = true } = options ?? {};
    const url = `/api/v1/pots`;
    const query = useSWR<TData, V1PotsRetrieve["error"], typeof url | null>(shouldFetch ? url : null, {
        ...v1PotsRetrieveQueryOptions<TData>(clientOptions),
        ...queryOptions
    });
    return query;
}