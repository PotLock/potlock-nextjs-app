import { walletApi } from "@/common/api/near";
import { NEAR_TOKEN_DENOM } from "@/common/constants";
import { ByTokenId } from "@/common/types";

import { PAGODA_REQUEST_CONFIG } from "./config";
import { swrHooks } from "./generated";

export type TokenMetadataInputs = ByTokenId & {
  disabled?: boolean;
};

export const useTokenMetadata = ({
  tokenId,
  disabled = false,
}: TokenMetadataInputs) => {
  const nearQueryResult = swrHooks.useGetAccountsAccountIdBalancesNEAR(
    walletApi.accountId ?? "unknown",
    undefined,

    {
      ...PAGODA_REQUEST_CONFIG,
      swr: { enabled: !disabled && tokenId === NEAR_TOKEN_DENOM },
    },
  );

  const ftQueryResult = swrHooks.useGetNep141MetadataContractAccountId(
    tokenId,
    undefined,

    {
      ...PAGODA_REQUEST_CONFIG,
      swr: { enabled: !disabled && tokenId !== NEAR_TOKEN_DENOM },
    },
  );

  return {
    ...(tokenId === NEAR_TOKEN_DENOM ? nearQueryResult : ftQueryResult),

    data:
      tokenId === NEAR_TOKEN_DENOM
        ? nearQueryResult.data?.data.balance.metadata
        : ftQueryResult.data?.data.metadata,
  };
};
