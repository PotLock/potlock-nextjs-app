import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  V1AccountsPotApplicationsRetrieve400,
  V1AccountsPotApplicationsRetrieve404,
  V1AccountsPotApplicationsRetrieve500,
  V1AccountsPotApplicationsRetrievePathParams,
  V1AccountsPotApplicationsRetrieveQueryResponse,
} from "../types/V1AccountsPotApplicationsRetrieve";
import { v1AccountsPotApplicationsRetrieveQueryResponseSchema } from "../zod/v1AccountsPotApplicationsRetrieveSchema";

type V1AccountsPotApplicationsRetrieveClient = typeof client<
  V1AccountsPotApplicationsRetrieveQueryResponse,
  | V1AccountsPotApplicationsRetrieve400
  | V1AccountsPotApplicationsRetrieve404
  | V1AccountsPotApplicationsRetrieve500,
  never
>;
type V1AccountsPotApplicationsRetrieve = {
  data: V1AccountsPotApplicationsRetrieveQueryResponse;
  error:
    | V1AccountsPotApplicationsRetrieve400
    | V1AccountsPotApplicationsRetrieve404
    | V1AccountsPotApplicationsRetrieve500;
  request: never;
  pathParams: V1AccountsPotApplicationsRetrievePathParams;
  queryParams: never;
  headerParams: never;
  response: V1AccountsPotApplicationsRetrieveQueryResponse;
  client: {
    parameters: Partial<Parameters<V1AccountsPotApplicationsRetrieveClient>[0]>;
    return: Awaited<ReturnType<V1AccountsPotApplicationsRetrieveClient>>;
  };
};
export function v1AccountsPotApplicationsRetrieveQueryOptions<
  TData = V1AccountsPotApplicationsRetrieve["response"],
>(
  accountId: V1AccountsPotApplicationsRetrievePathParams["account_id"],
  options: V1AccountsPotApplicationsRetrieve["client"]["parameters"] = {},
): SWRConfiguration<TData, V1AccountsPotApplicationsRetrieve["error"]> {
  return {
    fetcher: async () => {
      const res = await client<
        TData,
        V1AccountsPotApplicationsRetrieve["error"]
      >({
        method: "get",
        url: `/api/v1/accounts/${accountId}/pot_applications`,
        ...options,
      });
      return v1AccountsPotApplicationsRetrieveQueryResponseSchema.parse(
        res.data,
      );
    },
  };
}
/**
 * @link /api/v1/accounts/:account_id/pot_applications
 */
export function useV1AccountsPotApplicationsRetrieve<
  TData = V1AccountsPotApplicationsRetrieve["response"],
>(
  accountId: V1AccountsPotApplicationsRetrievePathParams["account_id"],
  options?: {
    query?: SWRConfiguration<TData, V1AccountsPotApplicationsRetrieve["error"]>;
    client?: V1AccountsPotApplicationsRetrieve["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, V1AccountsPotApplicationsRetrieve["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/api/v1/accounts/${accountId}/pot_applications`;
  const query = useSWR<
    TData,
    V1AccountsPotApplicationsRetrieve["error"],
    typeof url | null
  >(shouldFetch ? url : null, {
    ...v1AccountsPotApplicationsRetrieveQueryOptions<TData>(
      accountId,
      clientOptions,
    ),
    ...queryOptions,
  });
  return query;
}
