import {
  v1AccountsActivePotsRetrieve404Schema,
  v1AccountsActivePotsRetrieve500Schema,
  v1AccountsActivePotsRetrievePathParamsSchema,
  v1AccountsActivePotsRetrieveQueryParamsSchema,
  v1AccountsActivePotsRetrieveQueryResponseSchema,
} from "./v1AccountsActivePotsRetrieveSchema";
import {
  v1AccountsDonationsReceivedRetrieve404Schema,
  v1AccountsDonationsReceivedRetrieve500Schema,
  v1AccountsDonationsReceivedRetrievePathParamsSchema,
  v1AccountsDonationsReceivedRetrieveQueryResponseSchema,
} from "./v1AccountsDonationsReceivedRetrieveSchema";
import {
  v1AccountsDonationsSentRetrieve404Schema,
  v1AccountsDonationsSentRetrieve500Schema,
  v1AccountsDonationsSentRetrievePathParamsSchema,
  v1AccountsDonationsSentRetrieveQueryResponseSchema,
} from "./v1AccountsDonationsSentRetrieveSchema";
import {
  v1AccountsPayoutsReceivedRetrieve404Schema,
  v1AccountsPayoutsReceivedRetrieve500Schema,
  v1AccountsPayoutsReceivedRetrievePathParamsSchema,
  v1AccountsPayoutsReceivedRetrieveQueryResponseSchema,
} from "./v1AccountsPayoutsReceivedRetrieveSchema";
import {
  v1AccountsPotApplicationsRetrieve400Schema,
  v1AccountsPotApplicationsRetrieve404Schema,
  v1AccountsPotApplicationsRetrieve500Schema,
  v1AccountsPotApplicationsRetrievePathParamsSchema,
  v1AccountsPotApplicationsRetrieveQueryResponseSchema,
} from "./v1AccountsPotApplicationsRetrieveSchema";
import {
  v1AccountsRetrieve2404Schema,
  v1AccountsRetrieve2500Schema,
  v1AccountsRetrieve2PathParamsSchema,
  v1AccountsRetrieve2QueryResponseSchema,
} from "./v1AccountsRetrieve2Schema";
import {
  v1AccountsRetrieve500Schema,
  v1AccountsRetrieveQueryResponseSchema,
} from "./v1AccountsRetrieveSchema";
import {
  v1DonateContractConfigRetrieve500Schema,
  v1DonateContractConfigRetrieveQueryResponseSchema,
} from "./v1DonateContractConfigRetrieveSchema";
import {
  v1DonorsRetrieve500Schema,
  v1DonorsRetrieveQueryParamsSchema,
  v1DonorsRetrieveQueryResponseSchema,
} from "./v1DonorsRetrieveSchema";
import {
  v1ListsRegistrationsRetrieve404Schema,
  v1ListsRegistrationsRetrieve500Schema,
  v1ListsRegistrationsRetrievePathParamsSchema,
  v1ListsRegistrationsRetrieveQueryResponseSchema,
} from "./v1ListsRegistrationsRetrieveSchema";
import {
  v1ListsRetrieve2404Schema,
  v1ListsRetrieve2500Schema,
  v1ListsRetrieve2PathParamsSchema,
  v1ListsRetrieve2QueryResponseSchema,
} from "./v1ListsRetrieve2Schema";
import {
  v1ListsRetrieve500Schema,
  v1ListsRetrieveQueryResponseSchema,
} from "./v1ListsRetrieveSchema";
import {
  v1PotsApplicationsRetrieve404Schema,
  v1PotsApplicationsRetrievePathParamsSchema,
  v1PotsApplicationsRetrieveQueryResponseSchema,
} from "./v1PotsApplicationsRetrieveSchema";
import {
  v1PotsDonationsRetrieve404Schema,
  v1PotsDonationsRetrievePathParamsSchema,
  v1PotsDonationsRetrieveQueryResponseSchema,
} from "./v1PotsDonationsRetrieveSchema";
import {
  v1PotsPayoutsRetrieve404Schema,
  v1PotsPayoutsRetrievePathParamsSchema,
  v1PotsPayoutsRetrieveQueryResponseSchema,
} from "./v1PotsPayoutsRetrieveSchema";
import {
  v1PotsRetrieve2404Schema,
  v1PotsRetrieve2PathParamsSchema,
  v1PotsRetrieve2QueryResponseSchema,
} from "./v1PotsRetrieve2Schema";
import { v1PotsRetrieveQueryResponseSchema } from "./v1PotsRetrieveSchema";
import {
  v1PotsSponsorsRetrieve404Schema,
  v1PotsSponsorsRetrievePathParamsSchema,
  v1PotsSponsorsRetrieveQueryResponseSchema,
} from "./v1PotsSponsorsRetrieveSchema";
import {
  v1StatsRetrieve500Schema,
  v1StatsRetrieveQueryResponseSchema,
} from "./v1StatsRetrieveSchema";

export const operations = {
  v1_accounts_retrieve: {
    request: undefined,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: v1AccountsRetrieveQueryResponseSchema,
      500: v1AccountsRetrieve500Schema,
    },
  },
  v1_accounts_retrieve_2: {
    request: undefined,
    parameters: {
      path: v1AccountsRetrieve2PathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: v1AccountsRetrieve2QueryResponseSchema,
      404: v1AccountsRetrieve2404Schema,
      500: v1AccountsRetrieve2500Schema,
    },
  },
  v1_accounts_active_pots_retrieve: {
    request: undefined,
    parameters: {
      path: v1AccountsActivePotsRetrievePathParamsSchema,
      query: v1AccountsActivePotsRetrieveQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: v1AccountsActivePotsRetrieveQueryResponseSchema,
      404: v1AccountsActivePotsRetrieve404Schema,
      500: v1AccountsActivePotsRetrieve500Schema,
    },
  },
  v1_accounts_donations_received_retrieve: {
    request: undefined,
    parameters: {
      path: v1AccountsDonationsReceivedRetrievePathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: v1AccountsDonationsReceivedRetrieveQueryResponseSchema,
      404: v1AccountsDonationsReceivedRetrieve404Schema,
      500: v1AccountsDonationsReceivedRetrieve500Schema,
    },
  },
  v1_accounts_donations_sent_retrieve: {
    request: undefined,
    parameters: {
      path: v1AccountsDonationsSentRetrievePathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: v1AccountsDonationsSentRetrieveQueryResponseSchema,
      404: v1AccountsDonationsSentRetrieve404Schema,
      500: v1AccountsDonationsSentRetrieve500Schema,
    },
  },
  v1_accounts_payouts_received_retrieve: {
    request: undefined,
    parameters: {
      path: v1AccountsPayoutsReceivedRetrievePathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: v1AccountsPayoutsReceivedRetrieveQueryResponseSchema,
      404: v1AccountsPayoutsReceivedRetrieve404Schema,
      500: v1AccountsPayoutsReceivedRetrieve500Schema,
    },
  },
  v1_accounts_pot_applications_retrieve: {
    request: undefined,
    parameters: {
      path: v1AccountsPotApplicationsRetrievePathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: v1AccountsPotApplicationsRetrieveQueryResponseSchema,
      400: v1AccountsPotApplicationsRetrieve400Schema,
      404: v1AccountsPotApplicationsRetrieve404Schema,
      500: v1AccountsPotApplicationsRetrieve500Schema,
    },
  },
  v1_donate_contract_config_retrieve: {
    request: undefined,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: v1DonateContractConfigRetrieveQueryResponseSchema,
      500: v1DonateContractConfigRetrieve500Schema,
    },
  },
  v1_donors_retrieve: {
    request: undefined,
    parameters: {
      path: undefined,
      query: v1DonorsRetrieveQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: v1DonorsRetrieveQueryResponseSchema,
      500: v1DonorsRetrieve500Schema,
    },
  },
  v1_lists_retrieve: {
    request: undefined,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: v1ListsRetrieveQueryResponseSchema,
      500: v1ListsRetrieve500Schema,
    },
  },
  v1_lists_retrieve_2: {
    request: undefined,
    parameters: {
      path: v1ListsRetrieve2PathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: v1ListsRetrieve2QueryResponseSchema,
      404: v1ListsRetrieve2404Schema,
      500: v1ListsRetrieve2500Schema,
    },
  },
  v1_lists_registrations_retrieve: {
    request: undefined,
    parameters: {
      path: v1ListsRegistrationsRetrievePathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: v1ListsRegistrationsRetrieveQueryResponseSchema,
      404: v1ListsRegistrationsRetrieve404Schema,
      500: v1ListsRegistrationsRetrieve500Schema,
    },
  },
  v1_pots_retrieve: {
    request: undefined,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: v1PotsRetrieveQueryResponseSchema,
    },
  },
  v1_pots_retrieve_2: {
    request: undefined,
    parameters: {
      path: v1PotsRetrieve2PathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: v1PotsRetrieve2QueryResponseSchema,
      404: v1PotsRetrieve2404Schema,
    },
  },
  v1_pots_applications_retrieve: {
    request: undefined,
    parameters: {
      path: v1PotsApplicationsRetrievePathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: v1PotsApplicationsRetrieveQueryResponseSchema,
      404: v1PotsApplicationsRetrieve404Schema,
    },
  },
  v1_pots_donations_retrieve: {
    request: undefined,
    parameters: {
      path: v1PotsDonationsRetrievePathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: v1PotsDonationsRetrieveQueryResponseSchema,
      404: v1PotsDonationsRetrieve404Schema,
    },
  },
  v1_pots_payouts_retrieve: {
    request: undefined,
    parameters: {
      path: v1PotsPayoutsRetrievePathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: v1PotsPayoutsRetrieveQueryResponseSchema,
      404: v1PotsPayoutsRetrieve404Schema,
    },
  },
  v1_pots_sponsors_retrieve: {
    request: undefined,
    parameters: {
      path: v1PotsSponsorsRetrievePathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: v1PotsSponsorsRetrieveQueryResponseSchema,
      404: v1PotsSponsorsRetrieve404Schema,
    },
  },
  v1_stats_retrieve: {
    request: undefined,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: v1StatsRetrieveQueryResponseSchema,
      500: v1StatsRetrieve500Schema,
    },
  },
} as const;
export const paths = {
  "/api/v1/accounts": {
    get: operations["v1_accounts_retrieve"],
  },
  "/api/v1/accounts/{account_id}": {
    get: operations["v1_accounts_retrieve_2"],
  },
  "/api/v1/accounts/{account_id}/active_pots": {
    get: operations["v1_accounts_active_pots_retrieve"],
  },
  "/api/v1/accounts/{account_id}/donations_received": {
    get: operations["v1_accounts_donations_received_retrieve"],
  },
  "/api/v1/accounts/{account_id}/donations_sent": {
    get: operations["v1_accounts_donations_sent_retrieve"],
  },
  "/api/v1/accounts/{account_id}/payouts_received": {
    get: operations["v1_accounts_payouts_received_retrieve"],
  },
  "/api/v1/accounts/{account_id}/pot_applications": {
    get: operations["v1_accounts_pot_applications_retrieve"],
  },
  "/api/v1/donate_contract_config": {
    get: operations["v1_donate_contract_config_retrieve"],
  },
  "/api/v1/donors": {
    get: operations["v1_donors_retrieve"],
  },
  "/api/v1/lists": {
    get: operations["v1_lists_retrieve"],
  },
  "/api/v1/lists/{list_id}": {
    get: operations["v1_lists_retrieve_2"],
  },
  "/api/v1/lists/{list_id}/registrations": {
    get: operations["v1_lists_registrations_retrieve"],
  },
  "/api/v1/pots": {
    get: operations["v1_pots_retrieve"],
  },
  "/api/v1/pots/{pot_id}/": {
    get: operations["v1_pots_retrieve_2"],
  },
  "/api/v1/pots/{pot_id}/applications": {
    get: operations["v1_pots_applications_retrieve"],
  },
  "/api/v1/pots/{pot_id}/donations": {
    get: operations["v1_pots_donations_retrieve"],
  },
  "/api/v1/pots/{pot_id}/payouts": {
    get: operations["v1_pots_payouts_retrieve"],
  },
  "/api/v1/pots/{pot_id}/sponsors": {
    get: operations["v1_pots_sponsors_retrieve"],
  },
  "/api/v1/stats": {
    get: operations["v1_stats_retrieve"],
  },
} as const;
