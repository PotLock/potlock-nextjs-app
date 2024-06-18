import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  GetAccountsAccountIdNftContractAccountId500,
  GetAccountsAccountIdNftContractAccountIdPathParams,
  GetAccountsAccountIdNftContractAccountIdQueryParams,
  GetAccountsAccountIdNftContractAccountIdQueryResponse,
} from "../types/GetAccountsAccountIdNftContractAccountId";
import { getAccountsAccountIdNftContractAccountIdQueryResponseSchema } from "../zod/getAccountsAccountIdNftContractAccountIdSchema";

type GetAccountsAccountIdNftContractAccountIdClient = typeof client<
  GetAccountsAccountIdNftContractAccountIdQueryResponse,
  GetAccountsAccountIdNftContractAccountId500,
  never
>;
type GetAccountsAccountIdNftContractAccountId = {
  data: GetAccountsAccountIdNftContractAccountIdQueryResponse;
  error: GetAccountsAccountIdNftContractAccountId500;
  request: never;
  pathParams: GetAccountsAccountIdNftContractAccountIdPathParams;
  queryParams: GetAccountsAccountIdNftContractAccountIdQueryParams;
  headerParams: never;
  response: GetAccountsAccountIdNftContractAccountIdQueryResponse;
  client: {
    parameters: Partial<
      Parameters<GetAccountsAccountIdNftContractAccountIdClient>[0]
    >;
    return: Awaited<ReturnType<GetAccountsAccountIdNftContractAccountIdClient>>;
  };
};
export function getAccountsAccountIdNftContractAccountIdQueryOptions<
  TData = GetAccountsAccountIdNftContractAccountId["response"],
>(
  accountId: GetAccountsAccountIdNftContractAccountIdPathParams["account_id"],
  contractAccountId: GetAccountsAccountIdNftContractAccountIdPathParams["contract_account_id"],
  params?: GetAccountsAccountIdNftContractAccountId["queryParams"],
  options: GetAccountsAccountIdNftContractAccountId["client"]["parameters"] = {},
): SWRConfiguration<TData, GetAccountsAccountIdNftContractAccountId["error"]> {
  return {
    fetcher: async () => {
      const res = await client<
        TData,
        GetAccountsAccountIdNftContractAccountId["error"]
      >({
        method: "get",
        url: `/accounts/${accountId}/NFT/${contractAccountId}`,
        params,
        ...options,
      });
      return getAccountsAccountIdNftContractAccountIdQueryResponseSchema.parse(
        res.data,
      );
    },
  };
}
/**
 * @description This endpoint returns the list of NFTs with full details for the given `account_id`, NFT `contract_account_id`. You can use the `token_id` from this response and then request the NFT history for that token. **Limitations** * We currently provide the most recent 100 items.   Full-featured pagination will be provided soon.
 * @summary Get user's NFT collection by contract
 * @link /accounts/:account_id/NFT/:contract_account_id
 */
export function useGetAccountsAccountIdNftContractAccountId<
  TData = GetAccountsAccountIdNftContractAccountId["response"],
>(
  accountId: GetAccountsAccountIdNftContractAccountIdPathParams["account_id"],
  contractAccountId: GetAccountsAccountIdNftContractAccountIdPathParams["contract_account_id"],
  params?: GetAccountsAccountIdNftContractAccountId["queryParams"],
  options?: {
    query?: SWRConfiguration<
      TData,
      GetAccountsAccountIdNftContractAccountId["error"]
    >;
    client?: GetAccountsAccountIdNftContractAccountId["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, GetAccountsAccountIdNftContractAccountId["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/accounts/${accountId}/NFT/${contractAccountId}`;
  const query = useSWR<
    TData,
    GetAccountsAccountIdNftContractAccountId["error"],
    [typeof url, typeof params] | null
  >(shouldFetch ? [url, params] : null, {
    ...getAccountsAccountIdNftContractAccountIdQueryOptions<TData>(
      accountId,
      contractAccountId,
      params,
      clientOptions,
    ),
    ...queryOptions,
  });
  return query;
}
