import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  GetAccountsAccountIdBalancesFtContractAccountIdHistory500,
  GetAccountsAccountIdBalancesFtContractAccountIdHistoryPathParams,
  GetAccountsAccountIdBalancesFtContractAccountIdHistoryQueryParams,
  GetAccountsAccountIdBalancesFtContractAccountIdHistoryQueryResponse,
} from "../types/GetAccountsAccountIdBalancesFtContractAccountIdHistory";
import { getAccountsAccountIdBalancesFtContractAccountIdHistoryQueryResponseSchema } from "../zod/getAccountsAccountIdBalancesFtContractAccountIdHistorySchema";

type GetAccountsAccountIdBalancesFtContractAccountIdHistoryClient =
  typeof client<
    GetAccountsAccountIdBalancesFtContractAccountIdHistoryQueryResponse,
    GetAccountsAccountIdBalancesFtContractAccountIdHistory500,
    never
  >;
type GetAccountsAccountIdBalancesFtContractAccountIdHistory = {
  data: GetAccountsAccountIdBalancesFtContractAccountIdHistoryQueryResponse;
  error: GetAccountsAccountIdBalancesFtContractAccountIdHistory500;
  request: never;
  pathParams: GetAccountsAccountIdBalancesFtContractAccountIdHistoryPathParams;
  queryParams: GetAccountsAccountIdBalancesFtContractAccountIdHistoryQueryParams;
  headerParams: never;
  response: GetAccountsAccountIdBalancesFtContractAccountIdHistoryQueryResponse;
  client: {
    parameters: Partial<
      Parameters<GetAccountsAccountIdBalancesFtContractAccountIdHistoryClient>[0]
    >;
    return: Awaited<
      ReturnType<GetAccountsAccountIdBalancesFtContractAccountIdHistoryClient>
    >;
  };
};
export function getAccountsAccountIdBalancesFtContractAccountIdHistoryQueryOptions<
  TData = GetAccountsAccountIdBalancesFtContractAccountIdHistory["response"],
>(
  accountId: GetAccountsAccountIdBalancesFtContractAccountIdHistoryPathParams["account_id"],
  contractAccountId: GetAccountsAccountIdBalancesFtContractAccountIdHistoryPathParams["contract_account_id"],
  params?: GetAccountsAccountIdBalancesFtContractAccountIdHistory["queryParams"],
  options: GetAccountsAccountIdBalancesFtContractAccountIdHistory["client"]["parameters"] = {},
): SWRConfiguration<
  TData,
  GetAccountsAccountIdBalancesFtContractAccountIdHistory["error"]
> {
  return {
    fetcher: async () => {
      const res = await client<
        TData,
        GetAccountsAccountIdBalancesFtContractAccountIdHistory["error"]
      >({
        method: "get",
        url: `/accounts/${accountId}/balances/FT/${contractAccountId}/history`,
        params,
        ...options,
      });
      return getAccountsAccountIdBalancesFtContractAccountIdHistoryQueryResponseSchema.parse(
        res.data,
      );
    },
  };
}
/**
 * @description This endpoint returns the history of FT operations for the given `account_id`, `contract_account_id`. For the next page, use `event_index` of the last item in your previous response.
 * @summary Get user's FT history by contract
 * @link /accounts/:account_id/balances/FT/:contract_account_id/history
 */
export function useGetAccountsAccountIdBalancesFtContractAccountIdHistory<
  TData = GetAccountsAccountIdBalancesFtContractAccountIdHistory["response"],
>(
  accountId: GetAccountsAccountIdBalancesFtContractAccountIdHistoryPathParams["account_id"],
  contractAccountId: GetAccountsAccountIdBalancesFtContractAccountIdHistoryPathParams["contract_account_id"],
  params?: GetAccountsAccountIdBalancesFtContractAccountIdHistory["queryParams"],
  options?: {
    query?: SWRConfiguration<
      TData,
      GetAccountsAccountIdBalancesFtContractAccountIdHistory["error"]
    >;
    client?: GetAccountsAccountIdBalancesFtContractAccountIdHistory["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<
  TData,
  GetAccountsAccountIdBalancesFtContractAccountIdHistory["error"]
> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/accounts/${accountId}/balances/FT/${contractAccountId}/history`;
  const query = useSWR<
    TData,
    GetAccountsAccountIdBalancesFtContractAccountIdHistory["error"],
    [typeof url, typeof params] | null
  >(shouldFetch ? [url, params] : null, {
    ...getAccountsAccountIdBalancesFtContractAccountIdHistoryQueryOptions<TData>(
      accountId,
      contractAccountId,
      params,
      clientOptions,
    ),
    ...queryOptions,
  });
  return query;
}
