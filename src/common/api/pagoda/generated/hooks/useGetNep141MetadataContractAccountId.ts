import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  GetNep141MetadataContractAccountId500,
  GetNep141MetadataContractAccountIdPathParams,
  GetNep141MetadataContractAccountIdQueryParams,
  GetNep141MetadataContractAccountIdQueryResponse,
} from "../types/GetNep141MetadataContractAccountId";
import { getNep141MetadataContractAccountIdQueryResponseSchema } from "../zod/getNep141MetadataContractAccountIdSchema";

type GetNep141MetadataContractAccountIdClient = typeof client<
  GetNep141MetadataContractAccountIdQueryResponse,
  GetNep141MetadataContractAccountId500,
  never
>;
type GetNep141MetadataContractAccountId = {
  data: GetNep141MetadataContractAccountIdQueryResponse;
  error: GetNep141MetadataContractAccountId500;
  request: never;
  pathParams: GetNep141MetadataContractAccountIdPathParams;
  queryParams: GetNep141MetadataContractAccountIdQueryParams;
  headerParams: never;
  response: GetNep141MetadataContractAccountIdQueryResponse;
  client: {
    parameters: Partial<
      Parameters<GetNep141MetadataContractAccountIdClient>[0]
    >;
    return: Awaited<ReturnType<GetNep141MetadataContractAccountIdClient>>;
  };
};
export function getNep141MetadataContractAccountIdQueryOptions<
  TData = GetNep141MetadataContractAccountId["response"],
>(
  contractAccountId: GetNep141MetadataContractAccountIdPathParams["contract_account_id"],
  params?: GetNep141MetadataContractAccountId["queryParams"],
  options: GetNep141MetadataContractAccountId["client"]["parameters"] = {},
): SWRConfiguration<TData, GetNep141MetadataContractAccountId["error"]> {
  return {
    fetcher: async () => {
      const res = await client<
        TData,
        GetNep141MetadataContractAccountId["error"]
      >({
        method: "get",
        url: `/nep141/metadata/${contractAccountId}`,
        params,
        ...options,
      });
      return getNep141MetadataContractAccountIdQueryResponseSchema.parse(
        res.data,
      );
    },
  };
}
/**
 * @description This endpoint returns the metadata for the given `contract_account_id`, `block_timestamp_nanos`/`block_height`.
 * @summary Get FT metadata
 * @link /nep141/metadata/:contract_account_id
 */
export function useGetNep141MetadataContractAccountId<
  TData = GetNep141MetadataContractAccountId["response"],
>(
  contractAccountId: GetNep141MetadataContractAccountIdPathParams["contract_account_id"],
  params?: GetNep141MetadataContractAccountId["queryParams"],
  options?: {
    query?: SWRConfiguration<
      TData,
      GetNep141MetadataContractAccountId["error"]
    >;
    client?: GetNep141MetadataContractAccountId["client"]["parameters"];
    shouldFetch?: boolean;
  },
): SWRResponse<TData, GetNep141MetadataContractAccountId["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/nep141/metadata/${contractAccountId}`;
  const query = useSWR<
    TData,
    GetNep141MetadataContractAccountId["error"],
    [typeof url, typeof params] | null
  >(shouldFetch ? [url, params] : null, {
    ...getNep141MetadataContractAccountIdQueryOptions<TData>(
      contractAccountId,
      params,
      clientOptions,
    ),
    ...queryOptions,
  });
  return query;
}
