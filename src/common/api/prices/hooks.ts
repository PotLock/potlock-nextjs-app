import { ByTokenId } from "@/common/types";

import { PRICES_REQUEST_CONFIG } from "./config";
import * as swrBindings from "./generated/client";

/**
 * https://prices.intear.tech/swagger-ui/#/Token%20Prices/get_get_token_price
 */
export const useTokenUsdPrice = ({ tokenId }: Partial<ByTokenId>) => {
  const queryResult = swrBindings.useGetGetTokenPrice(
    { token_id: tokenId ?? "unknown" },

    {
      ...PRICES_REQUEST_CONFIG,
      swr: { enabled: Boolean(tokenId) },
    },
  );

  return { ...queryResult, data: queryResult.data?.data };
};
