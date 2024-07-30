import { POTLOCK_REQUEST_CONFIG } from "@/common/constants";
import { ByAccountId, ByListId } from "@/common/types";

import { swrHooks } from "./generated";
import {
  ByPotId,
  V1AccountsActivePotsRetrieveParams,
  V1AccountsDonationsReceivedRetrieveParams,
  V1AccountsDonationsSentRetrieveParams,
  V1AccountsPotApplicationsRetrieveParams,
  V1AccountsRetrieveParams,
  V1DonateContractConfigRetrieveParams,
  V1ListsRandomRegistrationRetrieveParams,
  V1ListsRegistrationsRetrieveParams,
  V1PotsRetrieveParams,
} from "./types";

/**
 * https://dev.potlock.io/api/schema/swagger-ui/#/v1/v1_donate_contract_config_retrieve
 */
export const useDonationConfig = (
  params?: V1DonateContractConfigRetrieveParams,
) => {
  const queryResult = swrHooks.useV1DonateContractConfigRetrieve(
    params,
    POTLOCK_REQUEST_CONFIG,
  );

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://dev.potlock.io/api/schema/swagger-ui/#/v1/v1_accounts_retrieve
 */
export const useAccounts = (params?: V1AccountsRetrieveParams) => {
  const queryResult = swrHooks.useV1AccountsRetrieve(params, {
    ...POTLOCK_REQUEST_CONFIG,
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
export const useAccountActivePots = ({
  accountId,
  ...params
}: Partial<ByAccountId> & V1AccountsActivePotsRetrieveParams) => {
  const queryResult = swrHooks.useV1AccountsActivePotsRetrieve(
    accountId ?? "unknown",
    params,
    { ...POTLOCK_REQUEST_CONFIG, swr: { enabled: Boolean(accountId) } },
  );

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://dev.potlock.io/api/schema/swagger-ui/#/v1/v1_accounts_pot_applications_retrieve
 */
export const useAccountPotApplications = ({
  accountId,
  ...params
}: Partial<ByAccountId> & V1AccountsPotApplicationsRetrieveParams) => {
  const queryResult = swrHooks.useV1AccountsPotApplicationsRetrieve(
    accountId ?? "unknown",
    params,
    { ...POTLOCK_REQUEST_CONFIG, swr: { enabled: Boolean(accountId) } },
  );

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://dev.potlock.io/api/schema/swagger-ui/#/v1/v1_pots_retrieve
 */
export const usePots = (params?: V1PotsRetrieveParams) => {
  const queryResult = swrHooks.useV1PotsRetrieve(
    params,
    POTLOCK_REQUEST_CONFIG,
  );

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://dev.potlock.io/api/schema/swagger-ui/#/v1/v1_accounts_donations_received_retrieve
 */
export const useAccountDonationsReceived = ({
  accountId,
  ...params
}: ByAccountId & V1AccountsDonationsReceivedRetrieveParams) => {
  const queryResult = swrHooks.useV1AccountsDonationsReceivedRetrieve(
    accountId,
    params,
    POTLOCK_REQUEST_CONFIG,
  );

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://dev.potlock.io/api/schema/swagger-ui/#/v1/v1_accounts_donations_sent_retrieve
 */
export const useAccountDonationsSent = ({
  accountId,
  ...params
}: ByAccountId & V1AccountsDonationsSentRetrieveParams) => {
  const queryResult = swrHooks.useV1AccountsDonationsSentRetrieve(
    accountId,
    params,
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
  ...params
}: ByListId & V1ListsRandomRegistrationRetrieveParams) => {
  const queryResult = swrHooks.useV1ListsRandomRegistrationRetrieve(
    listId,
    params,

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
  ...params
}: ByListId & V1ListsRegistrationsRetrieveParams) => {
  const queryResult = swrHooks.useV1ListsRegistrationsRetrieve(
    listId,
    params,
    POTLOCK_REQUEST_CONFIG,
  );

  return { ...queryResult, data: queryResult.data?.data };
};
