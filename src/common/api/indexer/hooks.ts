import type { AxiosResponse } from "axios";

import { envConfig } from "@/common/_config/production.env-config";
import { NOOP_STRING } from "@/common/constants";
import { isAccountId, isEthereumAddress } from "@/common/lib";
import {
  ByAccountId,
  ByListId,
  type ConditionalActivation,
  type LiveUpdateParams,
} from "@/common/types";

import * as generatedClient from "./internal/client.generated";
import { INDEXER_CLIENT_CONFIG, INDEXER_CLIENT_CONFIG_STAGING } from "./internal/config";
import { ByPotId } from "./types";

const currentNetworkConfig =
  process.env.NEXT_PUBLIC_ENV === "test" ? INDEXER_CLIENT_CONFIG : INDEXER_CLIENT_CONFIG_STAGING;

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_stats_retrieve
 */
export const useStats = () => {
  const queryResult = generatedClient.useV1StatsRetrieve(INDEXER_CLIENT_CONFIG);

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_donate_contract_config_retrieve
 */
export const useDonationConfig = (
  params?: generatedClient.V1DonateContractConfigRetrieveParams,
) => {
  const queryResult = generatedClient.useV1DonateContractConfigRetrieve(
    params,
    INDEXER_CLIENT_CONFIG,
  );

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_accounts_retrieve
 */
export const useAccounts = (params?: generatedClient.V1AccountsRetrieveParams) => {
  const queryResult = generatedClient.useV1AccountsRetrieve(params, {
    ...INDEXER_CLIENT_CONFIG,
  });

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_accounts_retrieve_2
 */
export const useAccount = ({ accountId, enabled = true }: ByAccountId & ConditionalActivation) => {
  const queryResult = generatedClient.useV1AccountsRetrieve2(accountId, {
    ...INDEXER_CLIENT_CONFIG,
    swr: { enabled: enabled && isAccountId(accountId) && !isEthereumAddress(accountId) },
  });

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_accounts_active_pots_retrieve
 */
export const useAccountActivePots = ({
  accountId,
  enabled = true,
  onSuccess,
  ...params
}: ByAccountId &
  generatedClient.V1AccountsActivePotsRetrieveParams &
  ConditionalActivation & {
    onSuccess?: (data: generatedClient.Pot[] | undefined) => void;
  }) => {
  const handleSuccessResults =
    onSuccess === undefined
      ? undefined
      : (data: AxiosResponse<generatedClient.PaginatedPotsResponse, unknown>) =>
          onSuccess(data.data.results);

  const queryResult = generatedClient.useV1AccountsActivePotsRetrieve(accountId, params, {
    ...INDEXER_CLIENT_CONFIG,
    swr: { enabled, onSuccess: handleSuccessResults },
  });

  return { ...queryResult, data: queryResult.data?.data.results };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_accounts_list_registrations_retrieve
 */
export const useAccountListRegistrations = ({
  enabled = true,
  live = false,
  accountId,
  ...params
}: ByAccountId &
  generatedClient.V1AccountsListRegistrationsRetrieveParams &
  ConditionalActivation &
  LiveUpdateParams) => {
  const queryResult = generatedClient.useV1AccountsListRegistrationsRetrieve(accountId, params, {
    ...INDEXER_CLIENT_CONFIG,

    swr: live
      ? {
          enabled,
        }
      : {
          enabled,
          shouldRetryOnError: (err) => err.status !== 404,
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
        },
  });

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_accounts_pot_applications_retrieve
 */
export const useAccountPotApplications = ({
  accountId,
  ...params
}: Partial<ByAccountId> & generatedClient.V1AccountsPotApplicationsRetrieveParams) => {
  const queryResult = generatedClient.useV1AccountsPotApplicationsRetrieve(
    accountId ?? NOOP_STRING,
    params,
    { ...INDEXER_CLIENT_CONFIG, swr: { enabled: Boolean(accountId) } },
  );

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_pots_retrieve
 */
export const usePots = (params?: generatedClient.V1PotsRetrieveParams) => {
  const queryResult = generatedClient.useV1PotsRetrieve(params, {
    ...INDEXER_CLIENT_CONFIG,
    swr: { refreshInterval: 3000 },
  });

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_pots_applications_retrieve
 */
export const usePotApplications = ({
  potId,
  ...params
}: Partial<ByPotId> & generatedClient.V1PotsApplicationsRetrieveParams) => {
  const queryResult = generatedClient.useV1PotsApplicationsRetrieve(potId ?? NOOP_STRING, params, {
    ...INDEXER_CLIENT_CONFIG,
    swr: { enabled: Boolean(potId) },
  });

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_accounts_donations_received_retrieve
 */
export const useAccountDonationsReceived = ({
  accountId,
  ...params
}: ByAccountId & generatedClient.V1AccountsDonationsReceivedRetrieveParams) => {
  const queryResult = generatedClient.useV1AccountsDonationsReceivedRetrieve(
    accountId,
    params,
    INDEXER_CLIENT_CONFIG,
  );

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_pots_donations_retrieve
 */

export const usePotDonations = ({
  potId,
  ...params
}: ByPotId & generatedClient.V1PotsDonationsRetrieveParams) => {
  const queryResult = generatedClient.useV1PotsDonationsRetrieve(potId, params, {
    ...INDEXER_CLIENT_CONFIG,
    swr: { enabled: Boolean(potId) },
  });

  return {
    ...queryResult,
    data: queryResult.data?.data?.results as generatedClient.Donation[],
  };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_accounts_donations_sent_retrieve
 */
export const useAccountDonationsSent = ({
  enabled = true,
  accountId,
  ...params
}: ByAccountId & generatedClient.V1AccountsDonationsSentRetrieveParams & ConditionalActivation) => {
  const queryResult = generatedClient.useV1AccountsDonationsSentRetrieve(accountId, params, {
    ...INDEXER_CLIENT_CONFIG,
    swr: { enabled },
  });

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_pots_retrieve_2
 */
export const usePot = ({ potId, enabled = true }: ByPotId & ConditionalActivation) => {
  const queryResult = generatedClient.useV1PotsRetrieve2(potId, {
    ...INDEXER_CLIENT_CONFIG,
    swr: { enabled, refreshInterval: 3000 },
  });

  return { ...queryResult, data: queryResult.data?.data };
};

export const usePotPayouts = ({
  potId,
  ...params
}: Partial<ByPotId> & generatedClient.V1PotsPayoutsRetrieveParams) => {
  const queryResult = generatedClient.useV1PotsPayoutsRetrieve(potId ?? NOOP_STRING, params, {
    ...INDEXER_CLIENT_CONFIG,
    swr: { enabled: Boolean(potId), refreshInterval: 3000 },
  });

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_lists_retrieve
 */
export const useList = ({ listId, enabled = true }: ByListId & ConditionalActivation) => {
  const queryResult = generatedClient.useV1ListsRetrieve2(listId, {
    ...INDEXER_CLIENT_CONFIG,
    swr: { enabled, refreshInterval: 3000 },
  });

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_lists_random_registration_retrieve
 *
 * Note: automatic refresh is disabled for optimization.
 *  Call `mutate()` for manual refresh.
 */
export const useRandomListRegistration = ({
  listId,
  ...params
}: ByListId & generatedClient.V1ListsRandomRegistrationRetrieveParams) => {
  const queryResult = generatedClient.useV1ListsRandomRegistrationRetrieve(
    listId,
    params,

    {
      ...INDEXER_CLIENT_CONFIG,
      swr: { revalidateIfStale: false, revalidateOnFocus: false },
    },
  );

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_lists_registrations_retrieve
 */
export const useListRegistrations = ({
  enabled = true,
  listId,
  ...params
}: ByListId & generatedClient.V1ListsRegistrationsRetrieveParams & ConditionalActivation) => {
  const queryResult = generatedClient.useV1ListsRegistrationsRetrieve(listId, params, {
    ...INDEXER_CLIENT_CONFIG,
    swr: { enabled },
  });

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/lists
 */

export const useLists = ({ ...params }: generatedClient.V1ListsRetrieveParams = {}) => {
  const queryResult = generatedClient.useV1ListsRetrieve(params, INDEXER_CLIENT_CONFIG);

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_accounts_upvoted_lists_retrieve
 */
export const useAccountUpvotedLists = ({
  enabled = true,
  accountId,
  ...params
}: ByAccountId & generatedClient.V1AccountsUpvotedListsRetrieveParams & ConditionalActivation) => {
  const queryResult = generatedClient.useV1AccountsUpvotedListsRetrieve(accountId, params, {
    ...INDEXER_CLIENT_CONFIG,
    swr: { enabled },
  });

  return {
    ...queryResult,
    data: queryResult.data?.data.results,
  };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_mpdao_voters_retrieve
 */
export const useMpdaoVoters = ({
  enabled = true,
  ...params
}: generatedClient.V1MpdaoVotersRetrieveParams & ConditionalActivation = {}) => {
  const queryResult = generatedClient.useV1MpdaoVotersRetrieve(params, {
    ...INDEXER_CLIENT_CONFIG,
    swr: { enabled },
  });

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_mpdao_voters_retrieve_2
 */
export const useMpdaoVoter = ({
  accountId,
  enabled = true,
}: ByAccountId & ConditionalActivation) => {
  const queryResult = generatedClient.useV1MpdaoVotersRetrieve2(accountId, {
    ...INDEXER_CLIENT_CONFIG,
    swr: { enabled },
  });

  return { ...queryResult, data: queryResult.data?.data };
};

/**
 * https://test-dev.potlock.io/api/schema/swagger-ui/#/v1/v1_campaigns_retrieve
 */

export const useCampaigns = ({
  enabled = true,
  ...params
}: generatedClient.V1CampaignsRetrieveParams & ConditionalActivation = {}) => {
  const queryResult = generatedClient.useV1CampaignsRetrieve(params, {
    ...currentNetworkConfig,
    swr: { enabled },
  });

  return { ...queryResult, data: queryResult.data?.data };
};

export const useCampaign = ({ campaignId }: { campaignId: number }) => {
  const queryResult = generatedClient.useV1CampaignsRetrieve2(campaignId, {
    ...currentNetworkConfig,
    swr: { enabled: true },
  });

  return { ...queryResult, data: queryResult.data?.data };
};
