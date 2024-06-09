import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  V1PotsRetrieve2404,
  V1PotsRetrieve2PathParams,
  V1PotsRetrieve2QueryResponse,
} from "../types/V1PotsRetrieve2";
import { v1PotsRetrieve2QueryResponseSchema } from "../zod/v1PotsRetrieve2Schema";

type V1PotsRetrieve2Client = typeof client<
  V1PotsRetrieve2QueryResponse,
  V1PotsRetrieve2404,
  never
>;
type V1PotsRetrieve2 = {
  data: V1PotsRetrieve2QueryResponse;
  error: V1PotsRetrieve2404;
  request: never;
  pathParams: V1PotsRetrieve2PathParams;
  queryParams: never;
  headerParams: never;
  response: V1PotsRetrieve2QueryResponse;
  client: {
    parameters: Partial<Parameters<V1PotsRetrieve2Client>[0]>;
    return: Awaited<ReturnType<V1PotsRetrieve2Client>>;
  };
};
export function v1PotsRetrieve2QueryOptions<
  TData = V1PotsRetrieve2["response"],
>(
  potId: V1PotsRetrieve2PathParams["pot_id"],
  options: V1PotsRetrieve2["client"]["parameters"] = {},
): SWRConfiguration<TData, V1PotsRetrieve2["error"]> {
  return {
    fetcher: async () => {
      const res = await client<TData, V1PotsRetrieve2["error"]>({
        method: "get",
        url: `/api/v1/pots/${potId}/`,
        ...options,
      });
      return v1PotsRetrieve2QueryResponseSchema.parse(res.data);
    },
  };
}
/**
 * @link /api/v1/pots/:pot_id/
 */
export function useV1PotsRetrieve2<TData = V1PotsRetrieve2["response"]>(
  potId: V1PotsRetrieve2PathParams["pot_id"],
  options?: {
    query?: SWRConfiguration<TData, V1PotsRetrieve2["error"]>;
    client?: V1PotsRetrieve2["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, V1PotsRetrieve2["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/api/v1/pots/${potId}/`;
  const query = useSWR<TData, V1PotsRetrieve2["error"], typeof url | null>(
    shouldFetch ? url : null,
    {
      ...v1PotsRetrieve2QueryOptions<TData>(potId, clientOptions),
      ...queryOptions,
    },
  );
  return query;
}
