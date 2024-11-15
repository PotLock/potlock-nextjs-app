import useSWR from "swr";

import { NATIVE_TOKEN_ID } from "@/common/constants";
import { ByTokenId } from "@/common/types";

import { CLIENT_CONFIG, client } from "./client";

export const useTokenUsdPrice = ({ tokenId }: Partial<ByTokenId>) => {
  const key = tokenId ? tokenId.toLowerCase() : null;

  return useSWR(
    tokenId === NATIVE_TOKEN_ID
      ? `/simple/price?ids=${key}&vs_currencies=usd`
      : `/simple/token_price?vs_currencies=usd&contract_addresses=${key}`,

    (url: string) =>
      client.get(url).then((response) => response.data[key ?? "unknown"].usd),

    { ...CLIENT_CONFIG.swr, enabled: key !== null },
  );
};

export const useOneNearUsdPrice = () =>
  useTokenUsdPrice({ tokenId: NATIVE_TOKEN_ID });
