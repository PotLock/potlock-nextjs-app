import { ZodiosHooks } from "@zodios/react";
import { infer as FromSchema } from "zod";

import { accountSchema } from "./generated";
import { getAPI } from "./generated/zodios";
import { POTLOCK_API_ENDPOINT } from "../../constants";
export * from "./generated";
export * from "./generated/zodios";

export type Account = FromSchema<typeof accountSchema>;

export type AccountId = Account["id"];

const client = getAPI(POTLOCK_API_ENDPOINT);

export const { useQuery: usePotlockQuery } = new ZodiosHooks("Potlock", client);

usePotlockQuery("");
