import { POTLOCK_REQUEST_CONFIG } from "@/common/constants";
import { ByAccountId, ConditionalExecution } from "@/common/types";

import { swrHooks } from "./generated";
import { ByPotId } from "./types";

export const useDonationConfig = () => {
  const queryResult = swrHooks.useV1DonateContractConfigRetrieve(
    POTLOCK_REQUEST_CONFIG,
  );

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://dev.potlock.io/api/schema/swagger-ui/#/v1/v1_accounts_retrieve
 */
export const useAccounts = (params?: ConditionalExecution) => {
  const queryResult = swrHooks.useV1AccountsRetrieve({
    ...POTLOCK_REQUEST_CONFIG,
    swr: { enabled: params?.enabled ?? true },
  });

  return { ...queryResult, data: queryResult.data?.data };
};

export const useAccount = ({ accountId }: Partial<ByAccountId>) => {
  const queryResult = swrHooks.useV1AccountsRetrieve2(accountId ?? "unknown", {
    ...POTLOCK_REQUEST_CONFIG,
    swr: { enabled: Boolean(accountId) },
  });

  return { ...queryResult, data: queryResult.data?.data };
};

export const useAccountActivePots = ({ accountId }: ByAccountId) => {
  const queryResult = swrHooks.useV1AccountsActivePotsRetrieve(
    accountId,
    { status: "live" },
    POTLOCK_REQUEST_CONFIG,
  );

  return { ...queryResult, data: queryResult.data?.data };
};

export const usePots = () => {
  const queryResult = swrHooks.useV1PotsRetrieve(POTLOCK_REQUEST_CONFIG);

  return { ...queryResult, data: queryResult.data?.data };
};

export const useAccountDonationsReceived = ({ accountId }: ByAccountId) => {
  const queryResult = swrHooks.useV1AccountsDonationsReceivedRetrieve(
    accountId,
    POTLOCK_REQUEST_CONFIG,
  );

  return { ...queryResult, data: queryResult.data?.data };
};

export const usePot = ({ potId }: Partial<ByPotId>) => {
  const queryResult = swrHooks.useV1PotsRetrieve2(potId ?? "unknown", {
    ...POTLOCK_REQUEST_CONFIG,
    swr: { enabled: Boolean(potId) },
  });

  return { ...queryResult, data: queryResult.data?.data };
};
