import { PAGODA_REQUEST_CONFIG } from "@/common/constants";

import { swrHooks } from "./generated";
import { ByAccountId } from "../potlock";

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
