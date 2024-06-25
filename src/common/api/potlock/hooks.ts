import { POTLOCK_REQUEST_CONFIG } from "@/common/constants";

import { swrHooks } from "./generated";
import {
  ByAccountId,
  ByPotId,
  V1AccountsPotApplicationsRetrieveParams,
} from "./types";

export const useAccounts = () => {
  const queryResult = swrHooks.useV1AccountsRetrieve(POTLOCK_REQUEST_CONFIG);

  return { ...queryResult, data: queryResult.data?.data };
};

export const useAccount = ({ accountId }: ByAccountId) => {
  const queryResult = swrHooks.useV1AccountsRetrieve2(
    accountId,
    POTLOCK_REQUEST_CONFIG,
  );

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

export const useAccountPotApplications = ({
  accountId,
  status,
}: ByAccountId & V1AccountsPotApplicationsRetrieveParams) => {
  const queryResult = swrHooks.useV1AccountsPotApplicationsRetrieve(
    accountId,
    { status },
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

export const usePot = ({ potId }: ByPotId) => {
  const queryResult = swrHooks.useV1PotsRetrieve2(
    potId,
    POTLOCK_REQUEST_CONFIG,
  );

  return { ...queryResult, data: queryResult.data?.data };
};
