import useSWR from "swr";

import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { ByTokenId } from "@/common/types";

import { CLIENT_CONFIG, client } from "./client";

export const useTokenUsdPrice = ({ tokenId }: ByTokenId) => {
  const key = tokenId.toLowerCase();

  return useSWR(
    tokenId === NEAR_TOKEN_DENOM
      ? `/simple/price?ids=${key}&vs_currencies=usd`
      : `/simple/token_price?vs_currencies=usd&contract_addresses=${key}`,

    (url: string) => client.get(url).then((response) => response.data[key].usd),
    CLIENT_CONFIG.swr,
  );
};

export const useOneNearUsdPrice = () =>
  useTokenUsdPrice({ tokenId: NEAR_TOKEN_DENOM });
