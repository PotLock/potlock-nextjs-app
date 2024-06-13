import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  V1PotsDonationsRetrieve404,
  V1PotsDonationsRetrievePathParams,
  V1PotsDonationsRetrieveQueryResponse,
} from "../types/V1PotsDonationsRetrieve";
import { v1PotsDonationsRetrieveQueryResponseSchema } from "../zod/v1PotsDonationsRetrieveSchema";

type V1PotsDonationsRetrieveClient = typeof client<
  V1PotsDonationsRetrieveQueryResponse,
  V1PotsDonationsRetrieve404,
  never
>;
type V1PotsDonationsRetrieve = {
  data: V1PotsDonationsRetrieveQueryResponse;
  error: V1PotsDonationsRetrieve404;
  request: never;
  pathParams: V1PotsDonationsRetrievePathParams;
  queryParams: never;
  headerParams: never;
  response: V1PotsDonationsRetrieveQueryResponse;
  client: {
    parameters: Partial<Parameters<V1PotsDonationsRetrieveClient>[0]>;
    return: Awaited<ReturnType<V1PotsDonationsRetrieveClient>>;
  };
};
export function v1PotsDonationsRetrieveQueryOptions<
  TData = V1PotsDonationsRetrieve["response"],
>(
  potId: V1PotsDonationsRetrievePathParams["pot_id"],
  options: V1PotsDonationsRetrieve["client"]["parameters"] = {},
): SWRConfiguration<TData, V1PotsDonationsRetrieve["error"]> {
  return {
    fetcher: async () => {
      const res = await client<TData, V1PotsDonationsRetrieve["error"]>({
        method: "get",
        url: `/api/v1/pots/${potId}/donations`,
        ...options,
      });
      return v1PotsDonationsRetrieveQueryResponseSchema.parse(res.data);
    },
  };
}
/**
 * @link /api/v1/pots/:pot_id/donations
 */
export function useV1PotsDonationsRetrieve<
  TData = V1PotsDonationsRetrieve["response"],
>(
  potId: V1PotsDonationsRetrievePathParams["pot_id"],
  options?: {
    query?: SWRConfiguration<TData, V1PotsDonationsRetrieve["error"]>;
    client?: V1PotsDonationsRetrieve["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, V1PotsDonationsRetrieve["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/api/v1/pots/${potId}/donations`;
  const query = useSWR<
    TData,
    V1PotsDonationsRetrieve["error"],
    typeof url | null
  >(shouldFetch ? url : null, {
    ...v1PotsDonationsRetrieveQueryOptions<TData>(potId, clientOptions),
    ...queryOptions,
  });
  return query;
}
