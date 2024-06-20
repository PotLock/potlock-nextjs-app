import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  V1AccountsPayoutsReceivedRetrieve404,
  V1AccountsPayoutsReceivedRetrieve500,
  V1AccountsPayoutsReceivedRetrievePathParams,
  V1AccountsPayoutsReceivedRetrieveQueryResponse,
} from "../types/V1AccountsPayoutsReceivedRetrieve";
import { v1AccountsPayoutsReceivedRetrieveQueryResponseSchema } from "../zod/v1AccountsPayoutsReceivedRetrieveSchema";

type V1AccountsPayoutsReceivedRetrieveClient = typeof client<
  V1AccountsPayoutsReceivedRetrieveQueryResponse,
  V1AccountsPayoutsReceivedRetrieve404 | V1AccountsPayoutsReceivedRetrieve500,
  never
>;
type V1AccountsPayoutsReceivedRetrieve = {
  data: V1AccountsPayoutsReceivedRetrieveQueryResponse;
  error:
    | V1AccountsPayoutsReceivedRetrieve404
    | V1AccountsPayoutsReceivedRetrieve500;
  request: never;
  pathParams: V1AccountsPayoutsReceivedRetrievePathParams;
  queryParams: never;
  headerParams: never;
  response: V1AccountsPayoutsReceivedRetrieveQueryResponse;
  client: {
    parameters: Partial<Parameters<V1AccountsPayoutsReceivedRetrieveClient>[0]>;
    return: Awaited<ReturnType<V1AccountsPayoutsReceivedRetrieveClient>>;
  };
};
export function v1AccountsPayoutsReceivedRetrieveQueryOptions<
  TData = V1AccountsPayoutsReceivedRetrieve["response"],
>(
  accountId: V1AccountsPayoutsReceivedRetrievePathParams["account_id"],
  options: V1AccountsPayoutsReceivedRetrieve["client"]["parameters"] = {},
): SWRConfiguration<TData, V1AccountsPayoutsReceivedRetrieve["error"]> {
  return {
    fetcher: async () => {
      const res = await client<
        TData,
        V1AccountsPayoutsReceivedRetrieve["error"]
      >({
        method: "get",
        url: `/api/v1/accounts/${accountId}/payouts_received`,
        ...options,
      });
      return v1AccountsPayoutsReceivedRetrieveQueryResponseSchema.parse(
        res.data,
      );
    },
  };
}
/**
 * @link /api/v1/accounts/:account_id/payouts_received
 */
export function useV1AccountsPayoutsReceivedRetrieve<
  TData = V1AccountsPayoutsReceivedRetrieve["response"],
>(
  accountId: V1AccountsPayoutsReceivedRetrievePathParams["account_id"],
  options?: {
    query?: SWRConfiguration<TData, V1AccountsPayoutsReceivedRetrieve["error"]>;
    client?: V1AccountsPayoutsReceivedRetrieve["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, V1AccountsPayoutsReceivedRetrieve["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/api/v1/accounts/${accountId}/payouts_received`;
  const query = useSWR<
    TData,
    V1AccountsPayoutsReceivedRetrieve["error"],
    typeof url | null
  >(shouldFetch ? url : null, {
    ...v1AccountsPayoutsReceivedRetrieveQueryOptions<TData>(
      accountId,
      clientOptions,
    ),
    ...queryOptions,
  });
  return query;
}
