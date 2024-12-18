import useSWR from "swr";

import { NATIVE_TOKEN_ID } from "@/common/constants";
import { ByTokenId, type WithDisabled } from "@/common/types";

import { CLIENT_CONFIG, client } from "./client";

export const useTokenUsdPrice = ({ tokenId, disabled }: ByTokenId & WithDisabled) => {
  return useSWR(
    [
      tokenId === NATIVE_TOKEN_ID
        ? `/simple/price?ids=${tokenId.toLowerCase()}&vs_currencies=usd`
        : `/simple/token_price?vs_currencies=usd&contract_addresses=${tokenId.toLowerCase()}`,

      tokenId.toLowerCase(),
    ],

    ([requestUri, tokenKey]: [string, string]) =>
      client.get(requestUri).then((response) => response.data[tokenKey].usd),

    { ...CLIENT_CONFIG.swr, enabled: !disabled },
  );
};

export const useOneNearUsdPrice = () => useTokenUsdPrice({ tokenId: NATIVE_TOKEN_ID });
