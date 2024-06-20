import client from "@kubb/swagger-client/client";
import useSWR from "swr";
import type { SWRConfiguration, SWRResponse } from "swr";

import type {
  V1DonateContractConfigRetrieve500,
  V1DonateContractConfigRetrieveQueryResponse,
} from "../types/V1DonateContractConfigRetrieve";
import { v1DonateContractConfigRetrieveQueryResponseSchema } from "../zod/v1DonateContractConfigRetrieveSchema";

type V1DonateContractConfigRetrieveClient = typeof client<
  V1DonateContractConfigRetrieveQueryResponse,
  V1DonateContractConfigRetrieve500,
  never
>;
type V1DonateContractConfigRetrieve = {
  data: V1DonateContractConfigRetrieveQueryResponse;
  error: V1DonateContractConfigRetrieve500;
  request: never;
  pathParams: never;
  queryParams: never;
  headerParams: never;
  response: V1DonateContractConfigRetrieveQueryResponse;
  client: {
    parameters: Partial<Parameters<V1DonateContractConfigRetrieveClient>[0]>;
    return: Awaited<ReturnType<V1DonateContractConfigRetrieveClient>>;
  };
};
export function v1DonateContractConfigRetrieveQueryOptions<
  TData = V1DonateContractConfigRetrieve["response"],
>(
  options: V1DonateContractConfigRetrieve["client"]["parameters"] = {},
): SWRConfiguration<TData, V1DonateContractConfigRetrieve["error"]> {
  return {
    fetcher: async () => {
      const res = await client<TData, V1DonateContractConfigRetrieve["error"]>({
        method: "get",
        url: `/api/v1/donate_contract_config`,
        ...options,
      });
      return v1DonateContractConfigRetrieveQueryResponseSchema.parse(res.data);
    },
  };
}
/**
 * @link /api/v1/donate_contract_config
 */
export function useV1DonateContractConfigRetrieve<
  TData = V1DonateContractConfigRetrieve["response"],
>(options?: {
  query?: SWRConfiguration<TData, V1DonateContractConfigRetrieve["error"]>;
  client?: V1DonateContractConfigRetrieve["client"]["parameters"];
  shouldFetch?: boolean;
}): SWRResponse<TData, V1DonateContractConfigRetrieve["error"]> {
  const {
    query: queryOptions,
    client: clientOptions = {},
    shouldFetch = true,
  } = options ?? {};
  const url = `/api/v1/donate_contract_config`;
  const query = useSWR<
    TData,
    V1DonateContractConfigRetrieve["error"],
    typeof url | null
  >(shouldFetch ? url : null, {
    ...v1DonateContractConfigRetrieveQueryOptions<TData>(clientOptions),
    ...queryOptions,
  });
  return query;
}
