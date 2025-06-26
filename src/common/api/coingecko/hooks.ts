import useSWR from "swr";

import { NATIVE_TOKEN_ID } from "@/common/constants";
import type { ConditionalActivation } from "@/common/types";

import { client } from "./client";

export const useNativeTokenUsdPrice = (
  { enabled = true }: ConditionalActivation | undefined = { enabled: true },
) =>
  useSWR(
    () => (!enabled ? null : ["oneNativeTokenUsdPrice", NATIVE_TOKEN_ID.toLowerCase()]),

    ([_queryKeyHead, tokenId]) =>
      client
        .get(`/simple/price?ids=${tokenId}&vs_currencies=usd`)
        .then((response: { data: { [key: string]: { usd: number } } }) =>
          response.data[tokenId].usd.toString(),
        ),

    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
