import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  V1DonorsRetrieve500,
  V1DonorsRetrieveQueryParams,
  V1DonorsRetrieveQueryResponse,
} from "../types/V1DonorsRetrieve";
import { v1DonorsRetrieveQueryResponseSchema } from "../zod/v1DonorsRetrieveSchema";

type V1DonorsRetrieveClient = typeof client<
  V1DonorsRetrieveQueryResponse,
  V1DonorsRetrieve500,
  never
>;
type V1DonorsRetrieve = {
  data: V1DonorsRetrieveQueryResponse;
  error: V1DonorsRetrieve500;
  request: never;
  pathParams: never;
  queryParams: V1DonorsRetrieveQueryParams;
  headerParams: never;
  response: V1DonorsRetrieveQueryResponse;
  client: {
    parameters: Partial<Parameters<V1DonorsRetrieveClient>[0]>;
    return: Awaited<ReturnType<V1DonorsRetrieveClient>>;
  };
};
export function v1DonorsRetrieveQueryOptions<
  TData = V1DonorsRetrieve["response"],
>(
  params?: V1DonorsRetrieve["queryParams"],
  options: V1DonorsRetrieve["client"]["parameters"] = {},
): SWRConfiguration<TData, V1DonorsRetrieve["error"]> {
  return {
    fetcher: async () => {
      const res = await client<TData, V1DonorsRetrieve["error"]>({
        method: "get",
        url: `/api/v1/donors`,
        params,
        ...options,
      });
      return v1DonorsRetrieveQueryResponseSchema.parse(res.data);
    },
  };
}
/**
 * @link /api/v1/donors
 */
export function useV1DonorsRetrieve<TData = V1DonorsRetrieve["response"]>(
  params?: V1DonorsRetrieve["queryParams"],
  options?: {
    query?: SWRConfiguration<TData, V1DonorsRetrieve["error"]>;
    client?: V1DonorsRetrieve["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, V1DonorsRetrieve["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/api/v1/donors`;
  const query = useSWR<
    TData,
    V1DonorsRetrieve["error"],
    [typeof url, typeof params] | null
  >(shouldFetch ? [url, params] : null, {
    ...v1DonorsRetrieveQueryOptions<TData>(params, clientOptions),
    ...queryOptions,
  });
  return query;
}
