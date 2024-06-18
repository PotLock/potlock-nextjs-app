import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  GetNftContractAccountIdTokenIdHistory500,
  GetNftContractAccountIdTokenIdHistoryPathParams,
  GetNftContractAccountIdTokenIdHistoryQueryParams,
  GetNftContractAccountIdTokenIdHistoryQueryResponse,
} from "../types/GetNftContractAccountIdTokenIdHistory";
import { getNftContractAccountIdTokenIdHistoryQueryResponseSchema } from "../zod/getNftContractAccountIdTokenIdHistorySchema";

type GetNftContractAccountIdTokenIdHistoryClient = typeof client<
  GetNftContractAccountIdTokenIdHistoryQueryResponse,
  GetNftContractAccountIdTokenIdHistory500,
  never
>;
type GetNftContractAccountIdTokenIdHistory = {
  data: GetNftContractAccountIdTokenIdHistoryQueryResponse;
  error: GetNftContractAccountIdTokenIdHistory500;
  request: never;
  pathParams: GetNftContractAccountIdTokenIdHistoryPathParams;
  queryParams: GetNftContractAccountIdTokenIdHistoryQueryParams;
  headerParams: never;
  response: GetNftContractAccountIdTokenIdHistoryQueryResponse;
  client: {
    parameters: Partial<
      Parameters<GetNftContractAccountIdTokenIdHistoryClient>[0]
    >;
    return: Awaited<ReturnType<GetNftContractAccountIdTokenIdHistoryClient>>;
  };
};
export function getNftContractAccountIdTokenIdHistoryQueryOptions<
  TData = GetNftContractAccountIdTokenIdHistory["response"],
>(
  contractAccountId: GetNftContractAccountIdTokenIdHistoryPathParams["contract_account_id"],
  tokenId: GetNftContractAccountIdTokenIdHistoryPathParams["token_id"],
  params?: GetNftContractAccountIdTokenIdHistory["queryParams"],
  options: GetNftContractAccountIdTokenIdHistory["client"]["parameters"] = {},
): SWRConfiguration<TData, GetNftContractAccountIdTokenIdHistory["error"]> {
  return {
    fetcher: async () => {
      const res = await client<
        TData,
        GetNftContractAccountIdTokenIdHistory["error"]
      >({
        method: "get",
        url: `/NFT/${contractAccountId}/${tokenId}/history`,
        params,
        ...options,
      });
      return getNftContractAccountIdTokenIdHistoryQueryResponseSchema.parse(
        res.data,
      );
    },
  };
}
/**
 * @description This endpoint returns the transaction history for the given NFT. **Note:** The result is centered around the history of the specific NFT and will return list of its passing owners. **Limitations** * For now, we only support NFT contracts that implement the Events NEP standard. * We currently provide the most recent 100 items.   Full-featured pagination will be provided soon.
 * @summary Get NFT history
 * @link /NFT/:contract_account_id/:token_id/history
 */
export function useGetNftContractAccountIdTokenIdHistory<
  TData = GetNftContractAccountIdTokenIdHistory["response"],
>(
  contractAccountId: GetNftContractAccountIdTokenIdHistoryPathParams["contract_account_id"],
  tokenId: GetNftContractAccountIdTokenIdHistoryPathParams["token_id"],
  params?: GetNftContractAccountIdTokenIdHistory["queryParams"],
  options?: {
    query?: SWRConfiguration<
      TData,
      GetNftContractAccountIdTokenIdHistory["error"]
    >;
    client?: GetNftContractAccountIdTokenIdHistory["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, GetNftContractAccountIdTokenIdHistory["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/NFT/${contractAccountId}/${tokenId}/history`;
  const query = useSWR<
    TData,
    GetNftContractAccountIdTokenIdHistory["error"],
    [typeof url, typeof params] | null
  >(shouldFetch ? [url, params] : null, {
    ...getNftContractAccountIdTokenIdHistoryQueryOptions<TData>(
      contractAccountId,
      tokenId,
      params,
      clientOptions,
    ),
    ...queryOptions,
  });
  return query;
}
