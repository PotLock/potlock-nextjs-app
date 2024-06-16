import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  V1AccountsDonationsReceivedRetrieve404,
  V1AccountsDonationsReceivedRetrieve500,
  V1AccountsDonationsReceivedRetrievePathParams,
  V1AccountsDonationsReceivedRetrieveQueryResponse,
} from "../types/V1AccountsDonationsReceivedRetrieve";
import { v1AccountsDonationsReceivedRetrieveQueryResponseSchema } from "../zod/v1AccountsDonationsReceivedRetrieveSchema";

type V1AccountsDonationsReceivedRetrieveClient = typeof client<
  V1AccountsDonationsReceivedRetrieveQueryResponse,
  | V1AccountsDonationsReceivedRetrieve404
  | V1AccountsDonationsReceivedRetrieve500,
  never
>;
type V1AccountsDonationsReceivedRetrieve = {
  data: V1AccountsDonationsReceivedRetrieveQueryResponse;
  error:
    | V1AccountsDonationsReceivedRetrieve404
    | V1AccountsDonationsReceivedRetrieve500;
  request: never;
  pathParams: V1AccountsDonationsReceivedRetrievePathParams;
  queryParams: never;
  headerParams: never;
  response: V1AccountsDonationsReceivedRetrieveQueryResponse;
  client: {
    parameters: Partial<
      Parameters<V1AccountsDonationsReceivedRetrieveClient>[0]
    >;
    return: Awaited<ReturnType<V1AccountsDonationsReceivedRetrieveClient>>;
  };
};
export function v1AccountsDonationsReceivedRetrieveQueryOptions<
  TData = V1AccountsDonationsReceivedRetrieve["response"],
>(
  accountId: V1AccountsDonationsReceivedRetrievePathParams["account_id"],
  options: V1AccountsDonationsReceivedRetrieve["client"]["parameters"] = {},
): SWRConfiguration<TData, V1AccountsDonationsReceivedRetrieve["error"]> {
  return {
    fetcher: async () => {
      const res = await client<
        TData,
        V1AccountsDonationsReceivedRetrieve["error"]
      >({
        method: "get",
        url: `/api/v1/accounts/${accountId}/donations_received`,
        ...options,
      });
      return v1AccountsDonationsReceivedRetrieveQueryResponseSchema.parse(
        res.data,
      );
    },
  };
}
/**
 * @link /api/v1/accounts/:account_id/donations_received
 */
export function useV1AccountsDonationsReceivedRetrieve<
  TData = V1AccountsDonationsReceivedRetrieve["response"],
>(
  accountId: V1AccountsDonationsReceivedRetrievePathParams["account_id"],
  options?: {
    query?: SWRConfiguration<
      TData,
      V1AccountsDonationsReceivedRetrieve["error"]
    >;
    client?: V1AccountsDonationsReceivedRetrieve["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, V1AccountsDonationsReceivedRetrieve["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/api/v1/accounts/${accountId}/donations_received`;
  const query = useSWR<
    TData,
    V1AccountsDonationsReceivedRetrieve["error"],
    typeof url | null
  >(shouldFetch ? url : null, {
    ...v1AccountsDonationsReceivedRetrieveQueryOptions<TData>(
      accountId,
      clientOptions,
    ),
    ...queryOptions,
  });
  return query;
}
