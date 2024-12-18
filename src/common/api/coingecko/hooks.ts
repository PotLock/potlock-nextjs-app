import useSWR from "swr";

import { NATIVE_TOKEN_ID } from "@/common/constants";

import { client } from "./client";

/**
 * @deprecated Use `data.usdPrice` from `tokenHooks.useToken({ tokenId: NATIVE_TOKEN_ID })`
 */
export const useOneNearUsdPrice = () => {
  return useSWR(
    () => ["coingeckoNearUsdPrice"],

    (_queryKey) =>
      client
        .get(`/simple/price?ids=${NATIVE_TOKEN_ID}&vs_currencies=usd`)
        .then((response: { data: { [key: string]: { usd: number } } }) =>
          response.data[NATIVE_TOKEN_ID].usd.toString(),
        ),
  );
};
