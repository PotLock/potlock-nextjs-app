import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  GetNftContractAccountIdTokenId500,
  GetNftContractAccountIdTokenIdPathParams,
  GetNftContractAccountIdTokenIdQueryParams,
  GetNftContractAccountIdTokenIdQueryResponse,
} from "../types/GetNftContractAccountIdTokenId";
import { getNftContractAccountIdTokenIdQueryResponseSchema } from "../zod/getNftContractAccountIdTokenIdSchema";

type GetNftContractAccountIdTokenIdClient = typeof client<
  GetNftContractAccountIdTokenIdQueryResponse,
  GetNftContractAccountIdTokenId500,
  never
>;
type GetNftContractAccountIdTokenId = {
  data: GetNftContractAccountIdTokenIdQueryResponse;
  error: GetNftContractAccountIdTokenId500;
  request: never;
  pathParams: GetNftContractAccountIdTokenIdPathParams;
  queryParams: GetNftContractAccountIdTokenIdQueryParams;
  headerParams: never;
  response: GetNftContractAccountIdTokenIdQueryResponse;
  client: {
    parameters: Partial<Parameters<GetNftContractAccountIdTokenIdClient>[0]>;
    return: Awaited<ReturnType<GetNftContractAccountIdTokenIdClient>>;
  };
};
export function getNftContractAccountIdTokenIdQueryOptions<
  TData = GetNftContractAccountIdTokenId["response"],
>(
  contractAccountId: GetNftContractAccountIdTokenIdPathParams["contract_account_id"],
  tokenId: GetNftContractAccountIdTokenIdPathParams["token_id"],
  params?: GetNftContractAccountIdTokenId["queryParams"],
  options: GetNftContractAccountIdTokenId["client"]["parameters"] = {},
): SWRConfiguration<TData, GetNftContractAccountIdTokenId["error"]> {
  return {
    fetcher: async () => {
      const res = await client<TData, GetNftContractAccountIdTokenId["error"]>({
        method: "get",
        url: `/NFT/${contractAccountId}/${tokenId}`,
        params,
        ...options,
      });
      return getNftContractAccountIdTokenIdQueryResponseSchema.parse(res.data);
    },
  };
}
/**
 * @description This endpoint returns detailed information on the NFT for the given `token_id`, NFT `contract_account_id`, `block_timestamp_nanos`/`block_height`.
 * @summary Get NFT
 * @link /NFT/:contract_account_id/:token_id
 */
export function useGetNftContractAccountIdTokenId<
  TData = GetNftContractAccountIdTokenId["response"],
>(
  contractAccountId: GetNftContractAccountIdTokenIdPathParams["contract_account_id"],
  tokenId: GetNftContractAccountIdTokenIdPathParams["token_id"],
  params?: GetNftContractAccountIdTokenId["queryParams"],
  options?: {
    query?: SWRConfiguration<TData, GetNftContractAccountIdTokenId["error"]>;
    client?: GetNftContractAccountIdTokenId["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, GetNftContractAccountIdTokenId["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/NFT/${contractAccountId}/${tokenId}`;
  const query = useSWR<
    TData,
    GetNftContractAccountIdTokenId["error"],
    [typeof url, typeof params] | null
  >(shouldFetch ? [url, params] : null, {
    ...getNftContractAccountIdTokenIdQueryOptions<TData>(
      contractAccountId,
      tokenId,
      params,
      clientOptions,
    ),
    ...queryOptions,
  });
  return query;
}
