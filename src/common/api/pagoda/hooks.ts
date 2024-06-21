import { NEAR_TOKEN_DENOM, PAGODA_REQUEST_CONFIG } from "@/common/constants";
import { walletApi } from "@/common/contracts";
import { AccountId, ByAccountId } from "@/common/types";

import { swrHooks } from "./generated";

export type TokenMetadataInputs = {
  /**
   * Either "NEAR" or FT contract account id.
   */
  tokenId: "near" | AccountId;
};

export const useTokenMetadata = ({ tokenId }: TokenMetadataInputs) => {
  const nearQueryResult = swrHooks.useGetAccountsAccountIdBalancesNEAR(
    walletApi.accountId ?? "unknown",
    undefined,

    {
      ...PAGODA_REQUEST_CONFIG,
      swr: { enabled: tokenId === NEAR_TOKEN_DENOM },
    },
  );

  const ftQueryResult = swrHooks.useGetNep141MetadataContractAccountId(
    walletApi.accountId ?? "unknown",
    undefined,

    {
      ...PAGODA_REQUEST_CONFIG,
      swr: { enabled: tokenId !== NEAR_TOKEN_DENOM },
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

export const useNearAccountBalance = ({ accountId }: ByAccountId) => {
  const queryResult = swrHooks.useGetAccountsAccountIdBalancesNEAR(
    accountId,
    undefined,
    PAGODA_REQUEST_CONFIG,
  );

  return { ...queryResult, data: queryResult.data?.data };
};

export const useFtAccountBalances = ({ accountId }: ByAccountId) => {
  const queryResult = swrHooks.useGetAccountsAccountIdBalancesFT(
    accountId,
    undefined,
    PAGODA_REQUEST_CONFIG,
  );

  return { ...queryResult, data: queryResult.data?.data };
};
