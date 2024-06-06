import { v1AccountsRetrieveQueryResponseSchema } from "../zod/v1AccountsRetrieveSchema";
import useSWR from "swr";
import client from "@kubb/swagger-client/client";
import type { SWRConfiguration, SWRResponse } from "swr";
import type { V1AccountsRetrieveQueryResponse, V1AccountsRetrieve500 } from "../types/V1AccountsRetrieve";

 type V1AccountsRetrieveClient = typeof client<V1AccountsRetrieveQueryResponse, V1AccountsRetrieve500, never>;
type V1AccountsRetrieve = {
    data: V1AccountsRetrieveQueryResponse;
    error: V1AccountsRetrieve500;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: V1AccountsRetrieveQueryResponse;
    client: {
        parameters: Partial<Parameters<V1AccountsRetrieveClient>[0]>;
        return: Awaited<ReturnType<V1AccountsRetrieveClient>>;
    };
};
export function v1AccountsRetrieveQueryOptions<TData = V1AccountsRetrieve["response"]>(options: V1AccountsRetrieve["client"]["parameters"] = {}): SWRConfiguration<TData, V1AccountsRetrieve["error"]> {
    return {
        fetcher: async () => {
            const res = await client<TData, V1AccountsRetrieve["error"]>({
                method: "get",
                url: `/api/v1/accounts`,
                ...options
            });
            return v1AccountsRetrieveQueryResponseSchema.parse(res.data);
        },
    };
}
/**
 * @link /api/v1/accounts
 */
export function useV1AccountsRetrieve<TData = V1AccountsRetrieve["response"]>(options?: {
    query?: SWRConfiguration<TData, V1AccountsRetrieve["error"]>;
    client?: V1AccountsRetrieve["client"]["parameters"];
    shouldFetch?: boolean;
}): SWRResponse<TData, V1AccountsRetrieve["error"]> {
    const { query: queryOptions, client: clientOptions = {}, shouldFetch = true } = options ?? {};
    const url = `/api/v1/accounts`;
    const query = useSWR<TData, V1AccountsRetrieve["error"], typeof url | null>(shouldFetch ? url : null, {
        ...v1AccountsRetrieveQueryOptions<TData>(clientOptions),
        ...queryOptions
    });
    return query;
}