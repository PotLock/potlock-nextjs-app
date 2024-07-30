import { NEAR_TOKEN_DENOM, PAGODA_REQUEST_CONFIG } from "@/common/constants";
import { walletApi } from "@/common/contracts";
import { ByAccountId, ByTokenId } from "@/common/types";

import { swrHooks } from "./generated";

export const useNearAccountBalance = ({ accountId }: Partial<ByAccountId>) => {
  const queryResult = swrHooks.useGetAccountsAccountIdBalancesNEAR(
    accountId ?? "unknown",
    undefined,
    { ...PAGODA_REQUEST_CONFIG, swr: { enabled: Boolean(accountId) } },
  );

  return { ...queryResult, data: queryResult.data?.data.balance };
};

export const useFtAccountBalances = ({ accountId }: Partial<ByAccountId>) => {
  const queryResult = swrHooks.useGetAccountsAccountIdBalancesFT(
    accountId ?? "unknown",
    undefined,
    { ...PAGODA_REQUEST_CONFIG, swr: { enabled: Boolean(accountId) } },
  );

  return { ...queryResult, data: queryResult.data?.data.balances };
};

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
