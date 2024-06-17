import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  V1AccountsDonationsSentRetrieve404,
  V1AccountsDonationsSentRetrieve500,
  V1AccountsDonationsSentRetrievePathParams,
  V1AccountsDonationsSentRetrieveQueryResponse,
} from "../types/V1AccountsDonationsSentRetrieve";
import { v1AccountsDonationsSentRetrieveQueryResponseSchema } from "../zod/v1AccountsDonationsSentRetrieveSchema";

type V1AccountsDonationsSentRetrieveClient = typeof client<
  V1AccountsDonationsSentRetrieveQueryResponse,
  V1AccountsDonationsSentRetrieve404 | V1AccountsDonationsSentRetrieve500,
  never
>;
type V1AccountsDonationsSentRetrieve = {
  data: V1AccountsDonationsSentRetrieveQueryResponse;
  error:
    | V1AccountsDonationsSentRetrieve404
    | V1AccountsDonationsSentRetrieve500;
  request: never;
  pathParams: V1AccountsDonationsSentRetrievePathParams;
  queryParams: never;
  headerParams: never;
  response: V1AccountsDonationsSentRetrieveQueryResponse;
  client: {
    parameters: Partial<Parameters<V1AccountsDonationsSentRetrieveClient>[0]>;
    return: Awaited<ReturnType<V1AccountsDonationsSentRetrieveClient>>;
  };
};
export function v1AccountsDonationsSentRetrieveQueryOptions<
  TData = V1AccountsDonationsSentRetrieve["response"],
>(
  accountId: V1AccountsDonationsSentRetrievePathParams["account_id"],
  options: V1AccountsDonationsSentRetrieve["client"]["parameters"] = {},
): SWRConfiguration<TData, V1AccountsDonationsSentRetrieve["error"]> {
  return {
    fetcher: async () => {
      const res = await client<TData, V1AccountsDonationsSentRetrieve["error"]>(
        {
          method: "get",
          url: `/api/v1/accounts/${accountId}/donations_sent`,
          ...options,
        },
      );
      return v1AccountsDonationsSentRetrieveQueryResponseSchema.parse(res.data);
    },
  };
}
/**
 * @link /api/v1/accounts/:account_id/donations_sent
 */
export function useV1AccountsDonationsSentRetrieve<
  TData = V1AccountsDonationsSentRetrieve["response"],
>(
  accountId: V1AccountsDonationsSentRetrievePathParams["account_id"],
  options?: {
    query?: SWRConfiguration<TData, V1AccountsDonationsSentRetrieve["error"]>;
    client?: V1AccountsDonationsSentRetrieve["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, V1AccountsDonationsSentRetrieve["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/api/v1/accounts/${accountId}/donations_sent`;
  const query = useSWR<
    TData,
    V1AccountsDonationsSentRetrieve["error"],
    typeof url | null
  >(shouldFetch ? url : null, {
    ...v1AccountsDonationsSentRetrieveQueryOptions<TData>(
      accountId,
      clientOptions,
    ),
    ...queryOptions,
  });
  return query;
}
