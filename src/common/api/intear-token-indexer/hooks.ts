import { ByTokenId, type ConditionalActivation, type LiveUpdateParams } from "@/common/types";

import * as generatedClient from "./internal/client.generated";
import { REQUEST_CONFIG } from "./internal/config";

/**
 * https://prices.intear.tech/swagger-ui/#/Token%20Prices/get_get_token_price
 */
export const useTokenUsdPrice = ({
  enabled = true,
  live = false,
  tokenId,
}: ByTokenId & ConditionalActivation & LiveUpdateParams) => {
  const queryResult = generatedClient.useGetSuperPrecisePrice(
    { token_id: tokenId },

    {
      ...REQUEST_CONFIG,

      swr: {
        enabled,
        shouldRetryOnError: (err) => err.status !== 404,

        ...(live
          ? {}
          : {
              revalidateIfStale: false,
              revalidateOnFocus: false,
              revalidateOnReconnect: false,
            }),
      },
    },
  );

  return { ...queryResult, data: queryResult.data?.data };
};
