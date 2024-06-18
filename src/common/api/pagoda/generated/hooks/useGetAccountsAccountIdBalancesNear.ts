import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  GetAccountsAccountIdBalancesNear500,
  GetAccountsAccountIdBalancesNearPathParams,
  GetAccountsAccountIdBalancesNearQueryParams,
  GetAccountsAccountIdBalancesNearQueryResponse,
} from "../types/GetAccountsAccountIdBalancesNear";
import { getAccountsAccountIdBalancesNearQueryResponseSchema } from "../zod/getAccountsAccountIdBalancesNearSchema";

type GetAccountsAccountIdBalancesNearClient = typeof client<
  GetAccountsAccountIdBalancesNearQueryResponse,
  GetAccountsAccountIdBalancesNear500,
  never
>;
type GetAccountsAccountIdBalancesNear = {
  data: GetAccountsAccountIdBalancesNearQueryResponse;
  error: GetAccountsAccountIdBalancesNear500;
  request: never;
  pathParams: GetAccountsAccountIdBalancesNearPathParams;
  queryParams: GetAccountsAccountIdBalancesNearQueryParams;
  headerParams: never;
  response: GetAccountsAccountIdBalancesNearQueryResponse;
  client: {
    parameters: Partial<Parameters<GetAccountsAccountIdBalancesNearClient>[0]>;
    return: Awaited<ReturnType<GetAccountsAccountIdBalancesNearClient>>;
  };
};
export function getAccountsAccountIdBalancesNearQueryOptions<
  TData = GetAccountsAccountIdBalancesNear["response"],
>(
  accountId: GetAccountsAccountIdBalancesNearPathParams["account_id"],
  params?: GetAccountsAccountIdBalancesNear["queryParams"],
  options: GetAccountsAccountIdBalancesNear["client"]["parameters"] = {},
): SWRConfiguration<TData, GetAccountsAccountIdBalancesNear["error"]> {
  return {
    fetcher: async () => {
      const res = await client<
        TData,
        GetAccountsAccountIdBalancesNear["error"]
      >({
        method: "get",
        url: `/accounts/${accountId}/balances/NEAR`,
        params,
        ...options,
      });
      return getAccountsAccountIdBalancesNearQueryResponseSchema.parse(
        res.data,
      );
    },
  };
}
/**
 * @description This endpoint returns the NEAR balance of the given `account_id` at the given `block_timestamp_nanos`/`block_height`.
 * @summary Get user's NEAR balance
 * @link /accounts/:account_id/balances/NEAR
 */
export function useGetAccountsAccountIdBalancesNear<
  TData = GetAccountsAccountIdBalancesNear["response"],
>(
  accountId: GetAccountsAccountIdBalancesNearPathParams["account_id"],
  params?: GetAccountsAccountIdBalancesNear["queryParams"],
  options?: {
    query?: SWRConfiguration<TData, GetAccountsAccountIdBalancesNear["error"]>;
    client?: GetAccountsAccountIdBalancesNear["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, GetAccountsAccountIdBalancesNear["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/accounts/${accountId}/balances/NEAR`;
  const query = useSWR<
    TData,
    GetAccountsAccountIdBalancesNear["error"],
    [typeof url, typeof params] | null
  >(shouldFetch ? [url, params] : null, {
    ...getAccountsAccountIdBalancesNearQueryOptions<TData>(
      accountId,
      params,
      clientOptions,
    ),
    ...queryOptions,
  });
  return query;
}
