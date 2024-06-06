import { ZodiosHooks } from "@zodios/react";
import { infer as FromSchema } from "zod";

import { accountSchema, potSchema } from "./generated";
import { getAPI } from "./generated/zodios";
import { POTLOCK_API_ENDPOINT } from "../../constants";
export * from "./generated";
export * from "./generated/zodios";

export type Account = FromSchema<typeof accountSchema>;

export type AccountId = Account["id"];

export type Pot = FromSchema<typeof potSchema>;

export type PotId = Pot["id"];

const client = getAPI(POTLOCK_API_ENDPOINT);

export const { useQuery: usePotlockQuery } = new ZodiosHooks("Potlock", client);
