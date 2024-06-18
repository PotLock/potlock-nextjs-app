import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  GetAccountsAccountIdBalancesFtContractAccountId500,
  GetAccountsAccountIdBalancesFtContractAccountIdPathParams,
  GetAccountsAccountIdBalancesFtContractAccountIdQueryParams,
  GetAccountsAccountIdBalancesFtContractAccountIdQueryResponse,
} from "../types/GetAccountsAccountIdBalancesFtContractAccountId";
import { getAccountsAccountIdBalancesFtContractAccountIdQueryResponseSchema } from "../zod/getAccountsAccountIdBalancesFtContractAccountIdSchema";

type GetAccountsAccountIdBalancesFtContractAccountIdClient = typeof client<
  GetAccountsAccountIdBalancesFtContractAccountIdQueryResponse,
  GetAccountsAccountIdBalancesFtContractAccountId500,
  never
>;
type GetAccountsAccountIdBalancesFtContractAccountId = {
  data: GetAccountsAccountIdBalancesFtContractAccountIdQueryResponse;
  error: GetAccountsAccountIdBalancesFtContractAccountId500;
  request: never;
  pathParams: GetAccountsAccountIdBalancesFtContractAccountIdPathParams;
  queryParams: GetAccountsAccountIdBalancesFtContractAccountIdQueryParams;
  headerParams: never;
  response: GetAccountsAccountIdBalancesFtContractAccountIdQueryResponse;
  client: {
    parameters: Partial<
      Parameters<GetAccountsAccountIdBalancesFtContractAccountIdClient>[0]
    >;
    return: Awaited<
      ReturnType<GetAccountsAccountIdBalancesFtContractAccountIdClient>
    >;
  };
};
export function getAccountsAccountIdBalancesFtContractAccountIdQueryOptions<
  TData = GetAccountsAccountIdBalancesFtContractAccountId["response"],
>(
  accountId: GetAccountsAccountIdBalancesFtContractAccountIdPathParams["account_id"],
  contractAccountId: GetAccountsAccountIdBalancesFtContractAccountIdPathParams["contract_account_id"],
  params?: GetAccountsAccountIdBalancesFtContractAccountId["queryParams"],
  options: GetAccountsAccountIdBalancesFtContractAccountId["client"]["parameters"] = {},
): SWRConfiguration<
  TData,
  GetAccountsAccountIdBalancesFtContractAccountId["error"]
> {
  return {
    fetcher: async () => {
      const res = await client<
        TData,
        GetAccountsAccountIdBalancesFtContractAccountId["error"]
      >({
        method: "get",
        url: `/accounts/${accountId}/balances/FT/${contractAccountId}`,
        params,
        ...options,
      });
      return getAccountsAccountIdBalancesFtContractAccountIdQueryResponseSchema.parse(
        res.data,
      );
    },
  };
}
/**
 * @description This endpoint returns FT balance of the given `account_id`, for the given `contract_account_id` and `block_timestamp_nanos`/`block_height`.
 * @summary Get user's FT balance by contract
 * @link /accounts/:account_id/balances/FT/:contract_account_id
 */
export function useGetAccountsAccountIdBalancesFtContractAccountId<
  TData = GetAccountsAccountIdBalancesFtContractAccountId["response"],
>(
  accountId: GetAccountsAccountIdBalancesFtContractAccountIdPathParams["account_id"],
  contractAccountId: GetAccountsAccountIdBalancesFtContractAccountIdPathParams["contract_account_id"],
  params?: GetAccountsAccountIdBalancesFtContractAccountId["queryParams"],
  options?: {
    query?: SWRConfiguration<
      TData,
      GetAccountsAccountIdBalancesFtContractAccountId["error"]
    >;
    client?: GetAccountsAccountIdBalancesFtContractAccountId["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<
  TData,
  GetAccountsAccountIdBalancesFtContractAccountId["error"]
> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/accounts/${accountId}/balances/FT/${contractAccountId}`;
  const query = useSWR<
    TData,
    GetAccountsAccountIdBalancesFtContractAccountId["error"],
    [typeof url, typeof params] | null
  >(shouldFetch ? [url, params] : null, {
    ...getAccountsAccountIdBalancesFtContractAccountIdQueryOptions<TData>(
      accountId,
      contractAccountId,
      params,
      clientOptions,
    ),
    ...queryOptions,
  });
  return query;
}
