import useSWR from "swr";

import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { FungibleTokenMetadata } from "@/common/types";

import { CLIENT_CONFIG, client } from "./client";

export const useTokenUsdPrice = ({
  symbol,
}: {
  symbol: FungibleTokenMetadata["symbol"];
}) => {
  const key = symbol.toLowerCase();

  return useSWR(
    `/simple/price?ids=${key}&vs_currencies=usd`,
    (url: string) => client.get(url).then((response) => response.data[key].usd),
    CLIENT_CONFIG.swr,
  );
};

export const useOneNearUsdPrice = () =>
  useTokenUsdPrice({ symbol: NEAR_TOKEN_DENOM });
