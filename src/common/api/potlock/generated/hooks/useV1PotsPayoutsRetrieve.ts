import { v1PotsPayoutsRetrieveQueryResponseSchema } from "../zod/v1PotsPayoutsRetrieveSchema";
import useSWR from "swr";
import client from "@kubb/swagger-client/client";
import type { SWRConfiguration, SWRResponse } from "swr";
import type { V1PotsPayoutsRetrieveQueryResponse, V1PotsPayoutsRetrievePathParams, V1PotsPayoutsRetrieve404 } from "../types/V1PotsPayoutsRetrieve";

 type V1PotsPayoutsRetrieveClient = typeof client<V1PotsPayoutsRetrieveQueryResponse, V1PotsPayoutsRetrieve404, never>;
type V1PotsPayoutsRetrieve = {
    data: V1PotsPayoutsRetrieveQueryResponse;
    error: V1PotsPayoutsRetrieve404;
    request: never;
    pathParams: V1PotsPayoutsRetrievePathParams;
    queryParams: never;
    headerParams: never;
    response: V1PotsPayoutsRetrieveQueryResponse;
    client: {
        parameters: Partial<Parameters<V1PotsPayoutsRetrieveClient>[0]>;
        return: Awaited<ReturnType<V1PotsPayoutsRetrieveClient>>;
    };
};
export function v1PotsPayoutsRetrieveQueryOptions<TData = V1PotsPayoutsRetrieve["response"]>(potId: V1PotsPayoutsRetrievePathParams["pot_id"], options: V1PotsPayoutsRetrieve["client"]["parameters"] = {}): SWRConfiguration<TData, V1PotsPayoutsRetrieve["error"]> {
    return {
        fetcher: async () => {
            const res = await client<TData, V1PotsPayoutsRetrieve["error"]>({
                method: "get",
                url: `/api/v1/pots/${potId}/payouts`,
                ...options
            });
            return v1PotsPayoutsRetrieveQueryResponseSchema.parse(res.data);
        },
    };
}
/**
 * @link /api/v1/pots/:pot_id/payouts
 */
export function useV1PotsPayoutsRetrieve<TData = V1PotsPayoutsRetrieve["response"]>(potId: V1PotsPayoutsRetrievePathParams["pot_id"], options?: {
    query?: SWRConfiguration<TData, V1PotsPayoutsRetrieve["error"]>;
    client?: V1PotsPayoutsRetrieve["client"]["parameters"];
    shouldFetch?: boolean;
}): SWRResponse<TData, V1PotsPayoutsRetrieve["error"]> {
    const { query: queryOptions, client: clientOptions = {}, shouldFetch = true } = options ?? {};
    const url = `/api/v1/pots/${potId}/payouts`;
    const query = useSWR<TData, V1PotsPayoutsRetrieve["error"], typeof url | null>(shouldFetch ? url : null, {
        ...v1PotsPayoutsRetrieveQueryOptions<TData>(potId, clientOptions),
        ...queryOptions
    });
    return query;
}