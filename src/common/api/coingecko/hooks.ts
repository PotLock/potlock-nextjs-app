import useSWR from "swr";

import { CONTRACT_SWR_CONFIG, NATIVE_TOKEN_ID } from "@/common/constants";
import type { WithDisabled } from "@/common/types";

import { client } from "./client";

export const useNativeTokenUsdPrice = (
  { disabled }: WithDisabled | undefined = { disabled: false },
) =>
  useSWR(
    () => (disabled ? null : ["oneNativeTokenUsdPrice", NATIVE_TOKEN_ID.toLowerCase()]),

    ([_queryKeyHead, tokenId]) =>
      client
        .get(`/simple/price?ids=${tokenId}&vs_currencies=usd`)
        .then((response: { data: { [key: string]: { usd: number } } }) =>
          response.data[tokenId].usd.toString(),
        ),

    CONTRACT_SWR_CONFIG,
  );
