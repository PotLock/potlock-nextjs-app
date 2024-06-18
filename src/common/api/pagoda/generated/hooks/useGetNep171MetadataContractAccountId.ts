import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  GetNep171MetadataContractAccountId500,
  GetNep171MetadataContractAccountIdPathParams,
  GetNep171MetadataContractAccountIdQueryParams,
  GetNep171MetadataContractAccountIdQueryResponse,
} from "../types/GetNep171MetadataContractAccountId";
import { getNep171MetadataContractAccountIdQueryResponseSchema } from "../zod/getNep171MetadataContractAccountIdSchema";

type GetNep171MetadataContractAccountIdClient = typeof client<
  GetNep171MetadataContractAccountIdQueryResponse,
  GetNep171MetadataContractAccountId500,
  never
>;
type GetNep171MetadataContractAccountId = {
  data: GetNep171MetadataContractAccountIdQueryResponse;
  error: GetNep171MetadataContractAccountId500;
  request: never;
  pathParams: GetNep171MetadataContractAccountIdPathParams;
  queryParams: GetNep171MetadataContractAccountIdQueryParams;
  headerParams: never;
  response: GetNep171MetadataContractAccountIdQueryResponse;
  client: {
    parameters: Partial<
      Parameters<GetNep171MetadataContractAccountIdClient>[0]
    >;
    return: Awaited<ReturnType<GetNep171MetadataContractAccountIdClient>>;
  };
};
export function getNep171MetadataContractAccountIdQueryOptions<
  TData = GetNep171MetadataContractAccountId["response"],
>(
  contractAccountId: GetNep171MetadataContractAccountIdPathParams["contract_account_id"],
  params?: GetNep171MetadataContractAccountId["queryParams"],
  options: GetNep171MetadataContractAccountId["client"]["parameters"] = {},
): SWRConfiguration<TData, GetNep171MetadataContractAccountId["error"]> {
  return {
    fetcher: async () => {
      const res = await client<
        TData,
        GetNep171MetadataContractAccountId["error"]
      >({
        method: "get",
        url: `/nep171/metadata/${contractAccountId}`,
        params,
        ...options,
      });
      return getNep171MetadataContractAccountIdQueryResponseSchema.parse(
        res.data,
      );
    },
  };
}
/**
 * @description This endpoint returns the metadata for a given NFT contract and `block_timestamp_nanos`/`block_height`. **Note:** This is contract-wide metadata. Each NFT also has its own metadata.
 * @summary Get NFT contract metadata
 * @link /nep171/metadata/:contract_account_id
 */
export function useGetNep171MetadataContractAccountId<
  TData = GetNep171MetadataContractAccountId["response"],
>(
  contractAccountId: GetNep171MetadataContractAccountIdPathParams["contract_account_id"],
  params?: GetNep171MetadataContractAccountId["queryParams"],
  options?: {
    query?: SWRConfiguration<
      TData,
      GetNep171MetadataContractAccountId["error"]
    >;
    client?: GetNep171MetadataContractAccountId["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, GetNep171MetadataContractAccountId["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/nep171/metadata/${contractAccountId}`;
  const query = useSWR<
    TData,
    GetNep171MetadataContractAccountId["error"],
    [typeof url, typeof params] | null
  >(shouldFetch ? [url, params] : null, {
    ...getNep171MetadataContractAccountIdQueryOptions<TData>(
      contractAccountId,
      params,
      clientOptions,
    ),
    ...queryOptions,
  });
  return query;
}
