import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  GetAccountsAccountIdBalancesFt500,
  GetAccountsAccountIdBalancesFtPathParams,
  GetAccountsAccountIdBalancesFtQueryParams,
  GetAccountsAccountIdBalancesFtQueryResponse,
} from "../types/GetAccountsAccountIdBalancesFt";
import { getAccountsAccountIdBalancesFtQueryResponseSchema } from "../zod/getAccountsAccountIdBalancesFtSchema";

type GetAccountsAccountIdBalancesFtClient = typeof client<
  GetAccountsAccountIdBalancesFtQueryResponse,
  GetAccountsAccountIdBalancesFt500,
  never
>;
type GetAccountsAccountIdBalancesFt = {
  data: GetAccountsAccountIdBalancesFtQueryResponse;
  error: GetAccountsAccountIdBalancesFt500;
  request: never;
  pathParams: GetAccountsAccountIdBalancesFtPathParams;
  queryParams: GetAccountsAccountIdBalancesFtQueryParams;
  headerParams: never;
  response: GetAccountsAccountIdBalancesFtQueryResponse;
  client: {
    parameters: Partial<Parameters<GetAccountsAccountIdBalancesFtClient>[0]>;
    return: Awaited<ReturnType<GetAccountsAccountIdBalancesFtClient>>;
  };
};
export function getAccountsAccountIdBalancesFtQueryOptions<
  TData = GetAccountsAccountIdBalancesFt["response"],
>(
  accountId: GetAccountsAccountIdBalancesFtPathParams["account_id"],
  params?: GetAccountsAccountIdBalancesFt["queryParams"],
  options: GetAccountsAccountIdBalancesFt["client"]["parameters"] = {},
): SWRConfiguration<TData, GetAccountsAccountIdBalancesFt["error"]> {
  return {
    fetcher: async () => {
      const res = await client<TData, GetAccountsAccountIdBalancesFt["error"]>({
        method: "get",
        url: `/accounts/${accountId}/balances/FT`,
        params,
        ...options,
      });
      return getAccountsAccountIdBalancesFtQueryResponseSchema.parse(res.data);
    },
  };
}
/**
 * @description This endpoint returns all non-zero FT balances of the given `account_id`, at the given `block_timestamp_nanos`/`block_height`. **Limitations** This endpoint scans all the FT contracts. We currently provide up to 100 results, which covers almost all the potential situations. Anyway, full-featured pagination will be provided soon.
 * @summary Get user's FT balances
 * @link /accounts/:account_id/balances/FT
 */
export function useGetAccountsAccountIdBalancesFt<
  TData = GetAccountsAccountIdBalancesFt["response"],
>(
  accountId: GetAccountsAccountIdBalancesFtPathParams["account_id"],
  params?: GetAccountsAccountIdBalancesFt["queryParams"],
  options?: {
    query?: SWRConfiguration<TData, GetAccountsAccountIdBalancesFt["error"]>;
    client?: GetAccountsAccountIdBalancesFt["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, GetAccountsAccountIdBalancesFt["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/accounts/${accountId}/balances/FT`;
  const query = useSWR<
    TData,
    GetAccountsAccountIdBalancesFt["error"],
    [typeof url, typeof params] | null
  >(shouldFetch ? [url, params] : null, {
    ...getAccountsAccountIdBalancesFtQueryOptions<TData>(
      accountId,
      params,
      clientOptions,
    ),
    ...queryOptions,
  });
  return query;
}
