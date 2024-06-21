import { PAGODA_REQUEST_CONFIG } from "@/common/constants";
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
    { ...PAGODA_REQUEST_CONFIG, swr: { enabled: tokenId === "near" } },
  );

  const ftQueryResult = swrHooks.useGetNep141MetadataContractAccountId(
    walletApi.accountId ?? "unknown",
    undefined,
    { ...PAGODA_REQUEST_CONFIG, swr: { enabled: tokenId !== "near" } },
  );

  return {
    ...(tokenId === "near" ? nearQueryResult : ftQueryResult),

    data:
      tokenId === "near"
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
