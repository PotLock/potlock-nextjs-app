import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  GetAccountsAccountIdNft500,
  GetAccountsAccountIdNftPathParams,
  GetAccountsAccountIdNftQueryParams,
  GetAccountsAccountIdNftQueryResponse,
} from "../types/GetAccountsAccountIdNft";
import { getAccountsAccountIdNftQueryResponseSchema } from "../zod/getAccountsAccountIdNftSchema";

type GetAccountsAccountIdNftClient = typeof client<
  GetAccountsAccountIdNftQueryResponse,
  GetAccountsAccountIdNft500,
  never
>;
type GetAccountsAccountIdNft = {
  data: GetAccountsAccountIdNftQueryResponse;
  error: GetAccountsAccountIdNft500;
  request: never;
  pathParams: GetAccountsAccountIdNftPathParams;
  queryParams: GetAccountsAccountIdNftQueryParams;
  headerParams: never;
  response: GetAccountsAccountIdNftQueryResponse;
  client: {
    parameters: Partial<Parameters<GetAccountsAccountIdNftClient>[0]>;
    return: Awaited<ReturnType<GetAccountsAccountIdNftClient>>;
  };
};
export function getAccountsAccountIdNftQueryOptions<
  TData = GetAccountsAccountIdNft["response"],
>(
  accountId: GetAccountsAccountIdNftPathParams["account_id"],
  params?: GetAccountsAccountIdNft["queryParams"],
  options: GetAccountsAccountIdNft["client"]["parameters"] = {},
): SWRConfiguration<TData, GetAccountsAccountIdNft["error"]> {
  return {
    fetcher: async () => {
      const res = await client<TData, GetAccountsAccountIdNft["error"]>({
        method: "get",
        url: `/accounts/${accountId}/NFT`,
        params,
        ...options,
      });
      return getAccountsAccountIdNftQueryResponseSchema.parse(res.data);
    },
  };
}
/**
 * @description For the given `account_id`, this endpoint returns the number of NFTs grouped by `contract_account_id`, together with the corresponding NFT contract metadata. The NFT contract will be present in the response if the `account_id` has at least one NFT there. **Limitations** * We currently provide the most recent 100 items.   Full-featured pagination will be provided soon.
 * @summary Get user's NFT collection overview
 * @link /accounts/:account_id/NFT
 */
export function useGetAccountsAccountIdNft<
  TData = GetAccountsAccountIdNft["response"],
>(
  accountId: GetAccountsAccountIdNftPathParams["account_id"],
  params?: GetAccountsAccountIdNft["queryParams"],
  options?: {
    query?: SWRConfiguration<TData, GetAccountsAccountIdNft["error"]>;
    client?: GetAccountsAccountIdNft["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, GetAccountsAccountIdNft["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/accounts/${accountId}/NFT`;
  const query = useSWR<
    TData,
    GetAccountsAccountIdNft["error"],
    [typeof url, typeof params] | null
  >(shouldFetch ? [url, params] : null, {
    ...getAccountsAccountIdNftQueryOptions<TData>(
      accountId,
      params,
      clientOptions,
    ),
    ...queryOptions,
  });
  return query;
}
