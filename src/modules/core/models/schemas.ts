import { string } from "zod";

import { near } from "@/common/api/near";
import { NETWORK } from "@/common/constants";

const primitive = string().min(5, "Account ID is too short");

export const validAccountId = primitive.refine(near.isAccountValid, {
  message: `Account does not exist on ${NETWORK}`,
});

export const validAccountIdOrNothing = primitive
  .optional()
  .nullable()
  .refine(
    async (accountId) =>
      typeof accountId === "string"
        ? await near.isAccountValid(accountId)
        : true,

    { message: `Account does not exist on ${NETWORK}` },
  );
