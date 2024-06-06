import { v1AccountsRetrieveQueryResponseSchema, v1AccountsRetrieve500Schema } from "./v1AccountsRetrieveSchema";
import { v1AccountsRetrieve2QueryResponseSchema, v1AccountsRetrieve2404Schema, v1AccountsRetrieve2500Schema, v1AccountsRetrieve2PathParamsSchema } from "./v1AccountsRetrieve2Schema";
import { v1AccountsActivePotsRetrieveQueryResponseSchema, v1AccountsActivePotsRetrieve404Schema, v1AccountsActivePotsRetrieve500Schema, v1AccountsActivePotsRetrievePathParamsSchema, v1AccountsActivePotsRetrieveQueryParamsSchema } from "./v1AccountsActivePotsRetrieveSchema";
import { v1DonorsRetrieveQueryResponseSchema, v1DonorsRetrieve500Schema, v1DonorsRetrieveQueryParamsSchema } from "./v1DonorsRetrieveSchema";
import { v1ListsRetrieveQueryResponseSchema, v1ListsRetrieve500Schema } from "./v1ListsRetrieveSchema";
import { v1ListsRetrieve2QueryResponseSchema, v1ListsRetrieve2404Schema, v1ListsRetrieve2500Schema, v1ListsRetrieve2PathParamsSchema } from "./v1ListsRetrieve2Schema";
import { v1ListsRegistrationsRetrieveQueryResponseSchema, v1ListsRegistrationsRetrieve404Schema, v1ListsRegistrationsRetrieve500Schema, v1ListsRegistrationsRetrievePathParamsSchema } from "./v1ListsRegistrationsRetrieveSchema";
import { v1PotsRetrieveQueryResponseSchema } from "./v1PotsRetrieveSchema";
import { v1PotsRetrieve2QueryResponseSchema, v1PotsRetrieve2404Schema, v1PotsRetrieve2PathParamsSchema } from "./v1PotsRetrieve2Schema";
import { v1PotsApplicationsRetrieveQueryResponseSchema, v1PotsApplicationsRetrieve404Schema, v1PotsApplicationsRetrievePathParamsSchema } from "./v1PotsApplicationsRetrieveSchema";
import { v1PotsDonationsRetrieveQueryResponseSchema, v1PotsDonationsRetrieve404Schema, v1PotsDonationsRetrievePathParamsSchema } from "./v1PotsDonationsRetrieveSchema";
import { v1PotsPayoutsRetrieveQueryResponseSchema, v1PotsPayoutsRetrieve404Schema, v1PotsPayoutsRetrievePathParamsSchema } from "./v1PotsPayoutsRetrieveSchema";
import { v1PotsSponsorsRetrieveQueryResponseSchema, v1PotsSponsorsRetrieve404Schema, v1PotsSponsorsRetrievePathParamsSchema } from "./v1PotsSponsorsRetrieveSchema";
import { v1StatsRetrieveQueryResponseSchema, v1StatsRetrieve500Schema } from "./v1StatsRetrieveSchema";

 export const operations = { "v1_accounts_retrieve": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: v1AccountsRetrieveQueryResponseSchema,
            500: v1AccountsRetrieve500Schema
        }
    }, "v1_accounts_retrieve_2": {
        request: undefined,
        parameters: {
            path: v1AccountsRetrieve2PathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: v1AccountsRetrieve2QueryResponseSchema,
            404: v1AccountsRetrieve2404Schema,
            500: v1AccountsRetrieve2500Schema
        }
    }, "v1_accounts_active_pots_retrieve": {
        request: undefined,
        parameters: {
            path: v1AccountsActivePotsRetrievePathParamsSchema,
            query: v1AccountsActivePotsRetrieveQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: v1AccountsActivePotsRetrieveQueryResponseSchema,
            404: v1AccountsActivePotsRetrieve404Schema,
            500: v1AccountsActivePotsRetrieve500Schema
        }
    }, "v1_donors_retrieve": {
        request: undefined,
        parameters: {
            path: undefined,
            query: v1DonorsRetrieveQueryParamsSchema,
            header: undefined
        },
        responses: {
            200: v1DonorsRetrieveQueryResponseSchema,
            500: v1DonorsRetrieve500Schema
        }
    }, "v1_lists_retrieve": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: v1ListsRetrieveQueryResponseSchema,
            500: v1ListsRetrieve500Schema
        }
    }, "v1_lists_retrieve_2": {
        request: undefined,
        parameters: {
            path: v1ListsRetrieve2PathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: v1ListsRetrieve2QueryResponseSchema,
            404: v1ListsRetrieve2404Schema,
            500: v1ListsRetrieve2500Schema
        }
    }, "v1_lists_registrations_retrieve": {
        request: undefined,
        parameters: {
            path: v1ListsRegistrationsRetrievePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: v1ListsRegistrationsRetrieveQueryResponseSchema,
            404: v1ListsRegistrationsRetrieve404Schema,
            500: v1ListsRegistrationsRetrieve500Schema
        }
    }, "v1_pots_retrieve": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: v1PotsRetrieveQueryResponseSchema
        }
    }, "v1_pots_retrieve_2": {
        request: undefined,
        parameters: {
            path: v1PotsRetrieve2PathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: v1PotsRetrieve2QueryResponseSchema,
            404: v1PotsRetrieve2404Schema
        }
    }, "v1_pots_applications_retrieve": {
        request: undefined,
        parameters: {
            path: v1PotsApplicationsRetrievePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: v1PotsApplicationsRetrieveQueryResponseSchema,
            404: v1PotsApplicationsRetrieve404Schema
        }
    }, "v1_pots_donations_retrieve": {
        request: undefined,
        parameters: {
            path: v1PotsDonationsRetrievePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: v1PotsDonationsRetrieveQueryResponseSchema,
            404: v1PotsDonationsRetrieve404Schema
        }
    }, "v1_pots_payouts_retrieve": {
        request: undefined,
        parameters: {
            path: v1PotsPayoutsRetrievePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: v1PotsPayoutsRetrieveQueryResponseSchema,
            404: v1PotsPayoutsRetrieve404Schema
        }
    }, "v1_pots_sponsors_retrieve": {
        request: undefined,
        parameters: {
            path: v1PotsSponsorsRetrievePathParamsSchema,
            query: undefined,
            header: undefined
        },
        responses: {
            200: v1PotsSponsorsRetrieveQueryResponseSchema,
            404: v1PotsSponsorsRetrieve404Schema
        }
    }, "v1_stats_retrieve": {
        request: undefined,
        parameters: {
            path: undefined,
            query: undefined,
            header: undefined
        },
        responses: {
            200: v1StatsRetrieveQueryResponseSchema,
            500: v1StatsRetrieve500Schema
        }
    } } as const;
export const paths = { "/api/v1/accounts": {
        get: operations["v1_accounts_retrieve"]
    }, "/api/v1/accounts/{account_id}": {
        get: operations["v1_accounts_retrieve_2"]
    }, "/api/v1/accounts/{account_id}/active_pots": {
        get: operations["v1_accounts_active_pots_retrieve"]
    }, "/api/v1/donors": {
        get: operations["v1_donors_retrieve"]
    }, "/api/v1/lists": {
        get: operations["v1_lists_retrieve"]
    }, "/api/v1/lists/{list_id}": {
        get: operations["v1_lists_retrieve_2"]
    }, "/api/v1/lists/{list_id}/registrations": {
        get: operations["v1_lists_registrations_retrieve"]
    }, "/api/v1/pots": {
        get: operations["v1_pots_retrieve"]
    }, "/api/v1/pots/{pot_id}/": {
        get: operations["v1_pots_retrieve_2"]
    }, "/api/v1/pots/{pot_id}/applications": {
        get: operations["v1_pots_applications_retrieve"]
    }, "/api/v1/pots/{pot_id}/donations": {
        get: operations["v1_pots_donations_retrieve"]
    }, "/api/v1/pots/{pot_id}/payouts": {
        get: operations["v1_pots_payouts_retrieve"]
    }, "/api/v1/pots/{pot_id}/sponsors": {
        get: operations["v1_pots_sponsors_retrieve"]
    }, "/api/v1/stats": {
        get: operations["v1_stats_retrieve"]
    } } as const;