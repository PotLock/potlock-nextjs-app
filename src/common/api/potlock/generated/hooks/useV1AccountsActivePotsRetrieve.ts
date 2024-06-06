import { v1AccountsActivePotsRetrieveQueryResponseSchema } from "../zod/v1AccountsActivePotsRetrieveSchema";
import useSWR from "swr";
import client from "@kubb/swagger-client/client";
import type { SWRConfiguration, SWRResponse } from "swr";
import type { V1AccountsActivePotsRetrieveQueryResponse, V1AccountsActivePotsRetrievePathParams, V1AccountsActivePotsRetrieveQueryParams, V1AccountsActivePotsRetrieve404, V1AccountsActivePotsRetrieve500 } from "../types/V1AccountsActivePotsRetrieve";

 type V1AccountsActivePotsRetrieveClient = typeof client<V1AccountsActivePotsRetrieveQueryResponse, V1AccountsActivePotsRetrieve404 | V1AccountsActivePotsRetrieve500, never>;
type V1AccountsActivePotsRetrieve = {
    data: V1AccountsActivePotsRetrieveQueryResponse;
    error: V1AccountsActivePotsRetrieve404 | V1AccountsActivePotsRetrieve500;
    request: never;
    pathParams: V1AccountsActivePotsRetrievePathParams;
    queryParams: V1AccountsActivePotsRetrieveQueryParams;
    headerParams: never;
    response: V1AccountsActivePotsRetrieveQueryResponse;
    client: {
        parameters: Partial<Parameters<V1AccountsActivePotsRetrieveClient>[0]>;
        return: Awaited<ReturnType<V1AccountsActivePotsRetrieveClient>>;
    };
};
export function v1AccountsActivePotsRetrieveQueryOptions<TData = V1AccountsActivePotsRetrieve["response"]>(accountId: V1AccountsActivePotsRetrievePathParams["account_id"], params?: V1AccountsActivePotsRetrieve["queryParams"], options: V1AccountsActivePotsRetrieve["client"]["parameters"] = {}): SWRConfiguration<TData, V1AccountsActivePotsRetrieve["error"]> {
    return {
        fetcher: async () => {
            const res = await client<TData, V1AccountsActivePotsRetrieve["error"]>({
                method: "get",
                url: `/api/v1/accounts/${accountId}/active_pots`,
                params,
                ...options
            });
            return v1AccountsActivePotsRetrieveQueryResponseSchema.parse(res.data);
        },
    };
}
/**
 * @link /api/v1/accounts/:account_id/active_pots
 */
export function useV1AccountsActivePotsRetrieve<TData = V1AccountsActivePotsRetrieve["response"]>(accountId: V1AccountsActivePotsRetrievePathParams["account_id"], params?: V1AccountsActivePotsRetrieve["queryParams"], options?: {
    query?: SWRConfiguration<TData, V1AccountsActivePotsRetrieve["error"]>;
    client?: V1AccountsActivePotsRetrieve["client"]["parameters"];
    shouldFetch?: boolean;
}): SWRResponse<TData, V1AccountsActivePotsRetrieve["error"]> {
    const { query: queryOptions, client: clientOptions = {}, shouldFetch = true } = options ?? {};
    const url = `/api/v1/accounts/${accountId}/active_pots`;
    const query = useSWR<TData, V1AccountsActivePotsRetrieve["error"], [
        typeof url,
        typeof params
    ] | null>(shouldFetch ? [url, params] : null, {
        ...v1AccountsActivePotsRetrieveQueryOptions<TData>(accountId, params, clientOptions),
        ...queryOptions
    });
    return query;
}