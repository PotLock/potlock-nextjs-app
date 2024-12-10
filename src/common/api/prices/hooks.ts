import { ByTokenId } from "@/common/types";

import * as generatedClient from "./internal/client.generated";
import { PRICES_REQUEST_CONFIG } from "./internal/config";

/**
 * https://prices.intear.tech/swagger-ui/#/Token%20Prices/get_get_token_price
 */
export const useTokenUsdPrice = ({ tokenId }: Partial<ByTokenId>) => {
  const queryResult = generatedClient.useGetGetTokenPrice(
    { token_id: tokenId ?? "unknown" },

    {
      ...PRICES_REQUEST_CONFIG,
      swr: { enabled: Boolean(tokenId) },
    },
  );

  return { ...queryResult, data: queryResult.data?.data };
};
