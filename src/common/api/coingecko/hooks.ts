import useSWR from "swr";

import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { FungibleTokenMetadata } from "@/common/types";

import { CLIENT_CONFIG, client } from "./client";

export const useTokenUsdPrice = ({
  symbol,
}: {
  symbol: FungibleTokenMetadata["symbol"];
}) =>
  useSWR(
    `/simple/price?ids=${symbol}&vs_currencies=usd`,

    (url: string) =>
      client.get(url).then((response) => response.data[symbol].usd),

    CLIENT_CONFIG.swr,
  );

export const useOneNearUsdPrice = () =>
  useTokenUsdPrice({ symbol: NEAR_TOKEN_DENOM });
