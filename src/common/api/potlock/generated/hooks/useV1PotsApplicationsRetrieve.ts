import { v1PotsApplicationsRetrieveQueryResponseSchema } from "../zod/v1PotsApplicationsRetrieveSchema";
import useSWR from "swr";
import client from "@kubb/swagger-client/client";
import type { SWRConfiguration, SWRResponse } from "swr";
import type { V1PotsApplicationsRetrieveQueryResponse, V1PotsApplicationsRetrievePathParams, V1PotsApplicationsRetrieve404 } from "../types/V1PotsApplicationsRetrieve";

 type V1PotsApplicationsRetrieveClient = typeof client<V1PotsApplicationsRetrieveQueryResponse, V1PotsApplicationsRetrieve404, never>;
type V1PotsApplicationsRetrieve = {
    data: V1PotsApplicationsRetrieveQueryResponse;
    error: V1PotsApplicationsRetrieve404;
    request: never;
    pathParams: V1PotsApplicationsRetrievePathParams;
    queryParams: never;
    headerParams: never;
    response: V1PotsApplicationsRetrieveQueryResponse;
    client: {
        parameters: Partial<Parameters<V1PotsApplicationsRetrieveClient>[0]>;
        return: Awaited<ReturnType<V1PotsApplicationsRetrieveClient>>;
    };
};
export function v1PotsApplicationsRetrieveQueryOptions<TData = V1PotsApplicationsRetrieve["response"]>(potId: V1PotsApplicationsRetrievePathParams["pot_id"], options: V1PotsApplicationsRetrieve["client"]["parameters"] = {}): SWRConfiguration<TData, V1PotsApplicationsRetrieve["error"]> {
    return {
        fetcher: async () => {
            const res = await client<TData, V1PotsApplicationsRetrieve["error"]>({
                method: "get",
                url: `/api/v1/pots/${potId}/applications`,
                ...options
            });
            return v1PotsApplicationsRetrieveQueryResponseSchema.parse(res.data);
        },
    };
}
/**
 * @link /api/v1/pots/:pot_id/applications
 */
export function useV1PotsApplicationsRetrieve<TData = V1PotsApplicationsRetrieve["response"]>(potId: V1PotsApplicationsRetrievePathParams["pot_id"], options?: {
    query?: SWRConfiguration<TData, V1PotsApplicationsRetrieve["error"]>;
    client?: V1PotsApplicationsRetrieve["client"]["parameters"];
    shouldFetch?: boolean;
}): SWRResponse<TData, V1PotsApplicationsRetrieve["error"]> {
    const { query: queryOptions, client: clientOptions = {}, shouldFetch = true } = options ?? {};
    const url = `/api/v1/pots/${potId}/applications`;
    const query = useSWR<TData, V1PotsApplicationsRetrieve["error"], typeof url | null>(shouldFetch ? url : null, {
        ...v1PotsApplicationsRetrieveQueryOptions<TData>(potId, clientOptions),
        ...queryOptions
    });
    return query;
}