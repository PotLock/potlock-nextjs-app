import { ByTokenId, type WithDisabled } from "@/common/types";

import * as generatedClient from "./internal/client.generated";
import { REQUEST_CONFIG } from "./internal/config";

/**
 * https://prices.intear.tech/swagger-ui/#/Token%20Prices/get_get_token_price
 */
export const useTokenUsdPrice = ({ tokenId, disabled = false }: ByTokenId & WithDisabled) => {
  const queryResult = generatedClient.useGetSuperPrecisePrice(
    { token_id: tokenId },

    {
      ...REQUEST_CONFIG,

      swr: {
        enabled: !disabled,
        shouldRetryOnError: (err) => err.status !== 404,
        revalidateOnFocus: false,
        revalidateIfStale: false,
      },
    },
  );

  return { ...queryResult, data: queryResult.data?.data };
};
