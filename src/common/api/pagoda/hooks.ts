import { PAGODA_REQUEST_CONFIG } from "@/common/constants";

import { swrHooks } from "./generated";
import { ByAccountId } from "../potlock";

export const useNearAccountBalance = ({ accountId }: ByAccountId) =>
  swrHooks.useGetAccountsAccountIdBalancesNear(
    accountId,
    undefined,
    PAGODA_REQUEST_CONFIG,
  );

export const useFtAccountBalances = ({ accountId }: ByAccountId) =>
  swrHooks.useGetAccountsAccountIdBalancesFt(
    accountId,
    undefined,
    PAGODA_REQUEST_CONFIG,
  );
