import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  GetAccountsAccountIdBalancesNearHistory500,
  GetAccountsAccountIdBalancesNearHistoryPathParams,
  GetAccountsAccountIdBalancesNearHistoryQueryParams,
  GetAccountsAccountIdBalancesNearHistoryQueryResponse,
} from "../types/GetAccountsAccountIdBalancesNearHistory";
import { getAccountsAccountIdBalancesNearHistoryQueryResponseSchema } from "../zod/getAccountsAccountIdBalancesNearHistorySchema";

type GetAccountsAccountIdBalancesNearHistoryClient = typeof client<
  GetAccountsAccountIdBalancesNearHistoryQueryResponse,
  GetAccountsAccountIdBalancesNearHistory500,
  never
>;
type GetAccountsAccountIdBalancesNearHistory = {
  data: GetAccountsAccountIdBalancesNearHistoryQueryResponse;
  error: GetAccountsAccountIdBalancesNearHistory500;
  request: never;
  pathParams: GetAccountsAccountIdBalancesNearHistoryPathParams;
  queryParams: GetAccountsAccountIdBalancesNearHistoryQueryParams;
  headerParams: never;
  response: GetAccountsAccountIdBalancesNearHistoryQueryResponse;
  client: {
    parameters: Partial<
      Parameters<GetAccountsAccountIdBalancesNearHistoryClient>[0]
    >;
    return: Awaited<ReturnType<GetAccountsAccountIdBalancesNearHistoryClient>>;
  };
};
export function getAccountsAccountIdBalancesNearHistoryQueryOptions<
  TData = GetAccountsAccountIdBalancesNearHistory["response"],
>(
  accountId: GetAccountsAccountIdBalancesNearHistoryPathParams["account_id"],
  params?: GetAccountsAccountIdBalancesNearHistory["queryParams"],
  options: GetAccountsAccountIdBalancesNearHistory["client"]["parameters"] = {},
): SWRConfiguration<TData, GetAccountsAccountIdBalancesNearHistory["error"]> {
  return {
    fetcher: async () => {
      const res = await client<
        TData,
        GetAccountsAccountIdBalancesNearHistory["error"]
      >({
        method: "get",
        url: `/accounts/${accountId}/balances/NEAR/history`,
        params,
        ...options,
      });
      return getAccountsAccountIdBalancesNearHistoryQueryResponseSchema.parse(
        res.data,
      );
    },
  };
}
/**
 * @description This endpoint returns the history of NEAR operations for the given `account_id`, `block_timestamp_nanos`/`block_height`. For the next page, use `event_index` of the last item in your previous response.
 * @summary Get user's NEAR history
 * @link /accounts/:account_id/balances/NEAR/history
 */
export function useGetAccountsAccountIdBalancesNearHistory<
  TData = GetAccountsAccountIdBalancesNearHistory["response"],
>(
  accountId: GetAccountsAccountIdBalancesNearHistoryPathParams["account_id"],
  params?: GetAccountsAccountIdBalancesNearHistory["queryParams"],
  options?: {
    query?: SWRConfiguration<
      TData,
      GetAccountsAccountIdBalancesNearHistory["error"]
    >;
    client?: GetAccountsAccountIdBalancesNearHistory["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, GetAccountsAccountIdBalancesNearHistory["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/accounts/${accountId}/balances/NEAR/history`;
  const query = useSWR<
    TData,
    GetAccountsAccountIdBalancesNearHistory["error"],
    [typeof url, typeof params] | null
  >(shouldFetch ? [url, params] : null, {
    ...getAccountsAccountIdBalancesNearHistoryQueryOptions<TData>(
      accountId,
      params,
      clientOptions,
    ),
    ...queryOptions,
  });
  return query;
}
