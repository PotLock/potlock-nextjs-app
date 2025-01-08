import { ByTokenId, type WithDisabled } from "@/common/types";

import * as generatedClient from "./internal/client.generated";
import { PRICES_REQUEST_CONFIG } from "./internal/config";

/**
 * https://prices.intear.tech/swagger-ui/#/Token%20Prices/get_get_token_price
 */
export const useTokenUsdPrice = ({ tokenId, disabled = false }: ByTokenId & WithDisabled) => {
  const queryResult = generatedClient.useGetSuperPrecisePrice(
    { token_id: tokenId },
    { ...PRICES_REQUEST_CONFIG, swr: { enabled: !disabled } },
  );

  return { ...queryResult, data: queryResult.data?.data };
};
