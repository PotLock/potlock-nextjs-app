import { string } from "zod";

import { NETWORK } from "@/common/_config";

import { isNearAccountValid } from "../utils/validations";

const primitive = string().min(5, "Account ID is too short");

export const validAccountId = primitive.refine(isNearAccountValid, {
  message: `Account doesn't exist on ${NETWORK}`,
});

export const validAccountIdOrNothing = primitive
  .optional()
  .nullable()
  .refine(
    async (accountId) =>
      typeof accountId === "string" ? await isNearAccountValid(accountId) : true,

    { message: `Account doesn't exist on ${NETWORK}` },
  );
