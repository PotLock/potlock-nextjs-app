import { makeApi, Zodios } from "@zodios/core";
import { v1AccountsRetrieveQueryResponseSchema, v1AccountsRetrieve500Schema } from "./zod/v1AccountsRetrieveSchema";
import { v1AccountsRetrieve2QueryResponseSchema, v1AccountsRetrieve2PathParamsSchema, v1AccountsRetrieve2404Schema, v1AccountsRetrieve2500Schema } from "./zod/v1AccountsRetrieve2Schema";
import { v1AccountsActivePotsRetrieveQueryResponseSchema, v1AccountsActivePotsRetrievePathParamsSchema, v1AccountsActivePotsRetrieveQueryParamsSchema, v1AccountsActivePotsRetrieve404Schema, v1AccountsActivePotsRetrieve500Schema } from "./zod/v1AccountsActivePotsRetrieveSchema";
import { v1DonorsRetrieveQueryResponseSchema, v1DonorsRetrieveQueryParamsSchema, v1DonorsRetrieve500Schema } from "./zod/v1DonorsRetrieveSchema";
import { v1ListsRetrieveQueryResponseSchema, v1ListsRetrieve500Schema } from "./zod/v1ListsRetrieveSchema";
import { v1ListsRetrieve2QueryResponseSchema, v1ListsRetrieve2PathParamsSchema, v1ListsRetrieve2404Schema, v1ListsRetrieve2500Schema } from "./zod/v1ListsRetrieve2Schema";
import { v1ListsRegistrationsRetrieveQueryResponseSchema, v1ListsRegistrationsRetrievePathParamsSchema, v1ListsRegistrationsRetrieve404Schema, v1ListsRegistrationsRetrieve500Schema } from "./zod/v1ListsRegistrationsRetrieveSchema";
import { v1PotsRetrieveQueryResponseSchema } from "./zod/v1PotsRetrieveSchema";
import { v1PotsRetrieve2QueryResponseSchema, v1PotsRetrieve2PathParamsSchema, v1PotsRetrieve2404Schema } from "./zod/v1PotsRetrieve2Schema";
import { v1PotsApplicationsRetrieveQueryResponseSchema, v1PotsApplicationsRetrievePathParamsSchema, v1PotsApplicationsRetrieve404Schema } from "./zod/v1PotsApplicationsRetrieveSchema";
import { v1PotsDonationsRetrieveQueryResponseSchema, v1PotsDonationsRetrievePathParamsSchema, v1PotsDonationsRetrieve404Schema } from "./zod/v1PotsDonationsRetrieveSchema";
import { v1PotsPayoutsRetrieveQueryResponseSchema, v1PotsPayoutsRetrievePathParamsSchema, v1PotsPayoutsRetrieve404Schema } from "./zod/v1PotsPayoutsRetrieveSchema";
import { v1PotsSponsorsRetrieveQueryResponseSchema, v1PotsSponsorsRetrievePathParamsSchema, v1PotsSponsorsRetrieve404Schema } from "./zod/v1PotsSponsorsRetrieveSchema";
import { v1StatsRetrieveQueryResponseSchema, v1StatsRetrieve500Schema } from "./zod/v1StatsRetrieveSchema";

 export const endpoints = makeApi([
    {
        method: "get",
        path: "/api/v1/accounts",
        description: ``,
        requestFormat: "json",
        parameters: [],
        response: v1AccountsRetrieveQueryResponseSchema,
        errors: [
            {
                status: 500,
                description: `Internal server error`,
                schema: v1AccountsRetrieve500Schema
            }
        ],
    },
    {
        method: "get",
        path: "/api/v1/accounts/:account_id",
        description: ``,
        requestFormat: "json",
        parameters: [
            {
                name: "account_id",
                description: ``,
                type: "Path",
                schema: v1AccountsRetrieve2PathParamsSchema.shape["account_id"]
            }
        ],
        response: v1AccountsRetrieve2QueryResponseSchema,
        errors: [
            {
                status: 404,
                description: `Account not found`,
                schema: v1AccountsRetrieve2404Schema
            },
            {
                status: 500,
                description: `Internal server error`,
                schema: v1AccountsRetrieve2500Schema
            }
        ],
    },
    {
        method: "get",
        path: "/api/v1/accounts/:account_id/active_pots",
        description: ``,
        requestFormat: "json",
        parameters: [
            {
                name: "account_id",
                description: ``,
                type: "Path",
                schema: v1AccountsActivePotsRetrievePathParamsSchema.shape["account_id"]
            },
            {
                name: "status",
                description: `Filter by pot status`,
                type: "Query",
                schema: v1AccountsActivePotsRetrieveQueryParamsSchema.unwrap().shape["status"]
            }
        ],
        response: v1AccountsActivePotsRetrieveQueryResponseSchema,
        errors: [
            {
                status: 404,
                description: `Account not found`,
                schema: v1AccountsActivePotsRetrieve404Schema
            },
            {
                status: 500,
                description: `Internal server error`,
                schema: v1AccountsActivePotsRetrieve500Schema
            }
        ],
    },
    {
        method: "get",
        path: "/api/v1/donors",
        description: ``,
        requestFormat: "json",
        parameters: [
            {
                name: "sort",
                description: `Sort by field, e.g., most_donated_usd`,
                type: "Query",
                schema: v1DonorsRetrieveQueryParamsSchema.unwrap().shape["sort"]
            }
        ],
        response: v1DonorsRetrieveQueryResponseSchema,
        errors: [
            {
                status: 500,
                description: `Internal server error`,
                schema: v1DonorsRetrieve500Schema
            }
        ],
    },
    {
        method: "get",
        path: "/api/v1/lists",
        description: ``,
        requestFormat: "json",
        parameters: [],
        response: v1ListsRetrieveQueryResponseSchema,
        errors: [
            {
                status: 500,
                description: `Internal server error`,
                schema: v1ListsRetrieve500Schema
            }
        ],
    },
    {
        method: "get",
        path: "/api/v1/lists/:list_id",
        description: ``,
        requestFormat: "json",
        parameters: [
            {
                name: "list_id",
                description: ``,
                type: "Path",
                schema: v1ListsRetrieve2PathParamsSchema.shape["list_id"]
            }
        ],
        response: v1ListsRetrieve2QueryResponseSchema,
        errors: [
            {
                status: 404,
                description: `List not found`,
                schema: v1ListsRetrieve2404Schema
            },
            {
                status: 500,
                description: `Internal server error`,
                schema: v1ListsRetrieve2500Schema
            }
        ],
    },
    {
        method: "get",
        path: "/api/v1/lists/:list_id/registrations",
        description: ``,
        requestFormat: "json",
        parameters: [
            {
                name: "list_id",
                description: ``,
                type: "Path",
                schema: v1ListsRegistrationsRetrievePathParamsSchema.shape["list_id"]
            }
        ],
        response: v1ListsRegistrationsRetrieveQueryResponseSchema,
        errors: [
            {
                status: 404,
                description: `List not found`,
                schema: v1ListsRegistrationsRetrieve404Schema
            },
            {
                status: 500,
                description: `Internal server error`,
                schema: v1ListsRegistrationsRetrieve500Schema
            }
        ],
    },
    {
        method: "get",
        path: "/api/v1/pots",
        description: ``,
        requestFormat: "json",
        parameters: [],
        response: v1PotsRetrieveQueryResponseSchema,
        errors: [],
    },
    {
        method: "get",
        path: "/api/v1/pots/:pot_id/",
        description: ``,
        requestFormat: "json",
        parameters: [
            {
                name: "pot_id",
                description: ``,
                type: "Path",
                schema: v1PotsRetrieve2PathParamsSchema.shape["pot_id"]
            }
        ],
        response: v1PotsRetrieve2QueryResponseSchema,
        errors: [
            {
                status: 404,
                description: `Pot not found`,
                schema: v1PotsRetrieve2404Schema
            }
        ],
    },
    {
        method: "get",
        path: "/api/v1/pots/:pot_id/applications",
        description: ``,
        requestFormat: "json",
        parameters: [
            {
                name: "pot_id",
                description: ``,
                type: "Path",
                schema: v1PotsApplicationsRetrievePathParamsSchema.shape["pot_id"]
            }
        ],
        response: v1PotsApplicationsRetrieveQueryResponseSchema,
        errors: [
            {
                status: 404,
                description: `Pot not found`,
                schema: v1PotsApplicationsRetrieve404Schema
            }
        ],
    },
    {
        method: "get",
        path: "/api/v1/pots/:pot_id/donations",
        description: ``,
        requestFormat: "json",
        parameters: [
            {
                name: "pot_id",
                description: ``,
                type: "Path",
                schema: v1PotsDonationsRetrievePathParamsSchema.shape["pot_id"]
            }
        ],
        response: v1PotsDonationsRetrieveQueryResponseSchema,
        errors: [
            {
                status: 404,
                description: `Pot not found`,
                schema: v1PotsDonationsRetrieve404Schema
            }
        ],
    },
    {
        method: "get",
        path: "/api/v1/pots/:pot_id/payouts",
        description: ``,
        requestFormat: "json",
        parameters: [
            {
                name: "pot_id",
                description: ``,
                type: "Path",
                schema: v1PotsPayoutsRetrievePathParamsSchema.shape["pot_id"]
            }
        ],
        response: v1PotsPayoutsRetrieveQueryResponseSchema,
        errors: [
            {
                status: 404,
                description: `Pot not found`,
                schema: v1PotsPayoutsRetrieve404Schema
            }
        ],
    },
    {
        method: "get",
        path: "/api/v1/pots/:pot_id/sponsors",
        description: ``,
        requestFormat: "json",
        parameters: [
            {
                name: "pot_id",
                description: ``,
                type: "Path",
                schema: v1PotsSponsorsRetrievePathParamsSchema.shape["pot_id"]
            }
        ],
        response: v1PotsSponsorsRetrieveQueryResponseSchema,
        errors: [
            {
                status: 404,
                description: `Pot not found`,
                schema: v1PotsSponsorsRetrieve404Schema
            }
        ],
    },
    {
        method: "get",
        path: "/api/v1/stats",
        description: ``,
        requestFormat: "json",
        parameters: [],
        response: v1StatsRetrieveQueryResponseSchema,
        errors: [
            {
                status: 500,
                description: `Internal server error`,
                schema: v1StatsRetrieve500Schema
            }
        ],
    }
]);
export const getAPI = (baseUrl: string) => new Zodios(baseUrl, endpoints);
export const api = new Zodios(endpoints);
export default api;