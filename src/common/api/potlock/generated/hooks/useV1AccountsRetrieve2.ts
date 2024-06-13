import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  V1AccountsRetrieve2404,
  V1AccountsRetrieve2500,
  V1AccountsRetrieve2PathParams,
  V1AccountsRetrieve2QueryResponse,
} from "../types/V1AccountsRetrieve2";
import { v1AccountsRetrieve2QueryResponseSchema } from "../zod/v1AccountsRetrieve2Schema";

type V1AccountsRetrieve2Client = typeof client<
  V1AccountsRetrieve2QueryResponse,
  V1AccountsRetrieve2404 | V1AccountsRetrieve2500,
  never
>;
type V1AccountsRetrieve2 = {
  data: V1AccountsRetrieve2QueryResponse;
  error: V1AccountsRetrieve2404 | V1AccountsRetrieve2500;
  request: never;
  pathParams: V1AccountsRetrieve2PathParams;
  queryParams: never;
  headerParams: never;
  response: V1AccountsRetrieve2QueryResponse;
  client: {
    parameters: Partial<Parameters<V1AccountsRetrieve2Client>[0]>;
    return: Awaited<ReturnType<V1AccountsRetrieve2Client>>;
  };
};
export function v1AccountsRetrieve2QueryOptions<
  TData = V1AccountsRetrieve2["response"],
>(
  accountId: V1AccountsRetrieve2PathParams["account_id"],
  options: V1AccountsRetrieve2["client"]["parameters"] = {},
): SWRConfiguration<TData, V1AccountsRetrieve2["error"]> {
  return {
    fetcher: async () => {
      const res = await client<TData, V1AccountsRetrieve2["error"]>({
        method: "get",
        url: `/api/v1/accounts/${accountId}`,
        ...options,
      });
      return v1AccountsRetrieve2QueryResponseSchema.parse(res.data);
    },
  };
}
/**
 * @link /api/v1/accounts/:account_id
 */
export function useV1AccountsRetrieve2<TData = V1AccountsRetrieve2["response"]>(
  accountId: V1AccountsRetrieve2PathParams["account_id"],
  options?: {
    query?: SWRConfiguration<TData, V1AccountsRetrieve2["error"]>;
    client?: V1AccountsRetrieve2["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, V1AccountsRetrieve2["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/api/v1/accounts/${accountId}`;
  const query = useSWR<TData, V1AccountsRetrieve2["error"], typeof url | null>(
    shouldFetch ? url : null,
    {
      ...v1AccountsRetrieve2QueryOptions<TData>(accountId, clientOptions),
      ...queryOptions,
    },
  );
  return query;
}
