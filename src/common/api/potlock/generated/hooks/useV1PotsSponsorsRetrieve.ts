import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  V1PotsSponsorsRetrieve404,
  V1PotsSponsorsRetrievePathParams,
  V1PotsSponsorsRetrieveQueryResponse,
} from "../types/V1PotsSponsorsRetrieve";
import { v1PotsSponsorsRetrieveQueryResponseSchema } from "../zod/v1PotsSponsorsRetrieveSchema";

type V1PotsSponsorsRetrieveClient = typeof client<
  V1PotsSponsorsRetrieveQueryResponse,
  V1PotsSponsorsRetrieve404,
  never
>;
type V1PotsSponsorsRetrieve = {
  data: V1PotsSponsorsRetrieveQueryResponse;
  error: V1PotsSponsorsRetrieve404;
  request: never;
  pathParams: V1PotsSponsorsRetrievePathParams;
  queryParams: never;
  headerParams: never;
  response: V1PotsSponsorsRetrieveQueryResponse;
  client: {
    parameters: Partial<Parameters<V1PotsSponsorsRetrieveClient>[0]>;
    return: Awaited<ReturnType<V1PotsSponsorsRetrieveClient>>;
  };
};
export function v1PotsSponsorsRetrieveQueryOptions<
  TData = V1PotsSponsorsRetrieve["response"],
>(
  potId: V1PotsSponsorsRetrievePathParams["pot_id"],
  options: V1PotsSponsorsRetrieve["client"]["parameters"] = {},
): SWRConfiguration<TData, V1PotsSponsorsRetrieve["error"]> {
  return {
    fetcher: async () => {
      const res = await client<TData, V1PotsSponsorsRetrieve["error"]>({
        method: "get",
        url: `/api/v1/pots/${potId}/sponsors`,
        ...options,
      });
      return v1PotsSponsorsRetrieveQueryResponseSchema.parse(res.data);
    },
  };
}
/**
 * @link /api/v1/pots/:pot_id/sponsors
 */
export function useV1PotsSponsorsRetrieve<
  TData = V1PotsSponsorsRetrieve["response"],
>(
  potId: V1PotsSponsorsRetrievePathParams["pot_id"],
  options?: {
    query?: SWRConfiguration<TData, V1PotsSponsorsRetrieve["error"]>;
    client?: V1PotsSponsorsRetrieve["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, V1PotsSponsorsRetrieve["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/api/v1/pots/${potId}/sponsors`;
  const query = useSWR<
    TData,
    V1PotsSponsorsRetrieve["error"],
    typeof url | null
  >(shouldFetch ? url : null, {
    ...v1PotsSponsorsRetrieveQueryOptions<TData>(potId, clientOptions),
    ...queryOptions,
  });
  return query;
}
