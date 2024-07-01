import { POTLOCK_REQUEST_CONFIG } from "@/common/constants";
import { ByAccountId, ByListId, ConditionalExecution } from "@/common/types";

import { swrHooks } from "./generated";
import {
  ByPotId,
  V1AccountsPotApplicationsRetrieveParams,
  V1ListsRandomRegistrationRetrieveParams,
  V1ListsRegistrationsRetrieveParams,
} from "./types";

/**
 * https://dev.potlock.io/api/schema/swagger-ui/#/v1/v1_donate_contract_config_retrieve
 */
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

/**
 * https://dev.potlock.io/api/schema/swagger-ui/#/v1/v1_accounts_retrieve_2
 */
export const useAccount = ({ accountId }: Partial<ByAccountId>) => {
  const queryResult = swrHooks.useV1AccountsRetrieve2(accountId ?? "unknown", {
    ...POTLOCK_REQUEST_CONFIG,
    swr: { enabled: Boolean(accountId) },
  });

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://dev.potlock.io/api/schema/swagger-ui/#/v1/v1_accounts_active_pots_retrieve
 */
export const useAccountActivePots = ({ accountId }: ByAccountId) => {
  const queryResult = swrHooks.useV1AccountsActivePotsRetrieve(
    accountId,
    { status: "live" },
    POTLOCK_REQUEST_CONFIG,
  );

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://dev.potlock.io/api/schema/swagger-ui/#/v1/v1_accounts_pot_applications_retrieve
 */
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

/**
 * https://dev.potlock.io/api/schema/swagger-ui/#/v1/v1_pots_retrieve
 */
export const usePots = () => {
  const queryResult = swrHooks.useV1PotsRetrieve(POTLOCK_REQUEST_CONFIG);

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://dev.potlock.io/api/schema/swagger-ui/#/v1/v1_accounts_donations_received_retrieve
 */
export const useAccountDonationsReceived = ({ accountId }: ByAccountId) => {
  const queryResult = swrHooks.useV1AccountsDonationsReceivedRetrieve(
    accountId,
    POTLOCK_REQUEST_CONFIG,
  );

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://dev.potlock.io/api/schema/swagger-ui/#/v1/v1_pots_retrieve_2
 */
export const usePot = ({ potId }: Partial<ByPotId>) => {
  const queryResult = swrHooks.useV1PotsRetrieve2(potId ?? "unknown", {
    ...POTLOCK_REQUEST_CONFIG,
    swr: { enabled: Boolean(potId) },
  });

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://dev.potlock.io/api/schema/swagger-ui/#/v1/v1_lists_random_registration_retrieve
 *
 * Note: automatic refresh is disabled for optimization.
 *  Call `mutate()` for manual refresh.
 */
export const useRandomListRegistration = ({
  listId,
  status,
}: ByListId & V1ListsRandomRegistrationRetrieveParams) => {
  const queryResult = swrHooks.useV1ListsRandomRegistrationRetrieve(
    listId,
    { status },

    {
      ...POTLOCK_REQUEST_CONFIG,
      swr: { revalidateIfStale: false, revalidateOnFocus: false },
    },
  );

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://dev.potlock.io/api/schema/swagger-ui/#/v1/v1_lists_registrations_retrieve
 */
export const useListRegistrations = ({
  listId,
  status,
}: ByListId & V1ListsRegistrationsRetrieveParams) => {
  const queryResult = swrHooks.useV1ListsRegistrationsRetrieve(
    listId,
    { status },
    POTLOCK_REQUEST_CONFIG,
  );

  return { ...queryResult, data: queryResult.data?.data };
};
