import { AccountView } from "near-api-js/lib/providers/provider";
import { string } from "zod";

import { nearRpc } from "@/common/api/near";
import { NETWORK } from "@/common/constants";

export const validAccountId = string()
  .min(5, "Account ID is too short")
  .refine(
    async (account_id) =>
      account_id.length > 4
        ? await nearRpc
            .query<AccountView>({
              request_type: "view_account",
              finality: "final",
              account_id,
            })
            .then((accountInfo) => accountInfo)
            .catch(() => false)
        : true,

    { message: `Account does not exist on ${NETWORK}` },
  );

export const validateAccountId = (
  accountId: string,
): Promise<string | undefined> => {
  // Check if the account ID is at least 5 characters long
  if (accountId.length < 5) {
    return Promise.resolve("Account ID is too short");
  }

  return nearRpc
    .query<AccountView>({
      request_type: "view_account",
      finality: "final",
      account_id: accountId,
    })
    .then((accountInfo) => {
      // If accountInfo is returned, the account exists
      return accountInfo ? undefined : `Account does not exist on ${NETWORK}`;
    })
    .catch(() => {
      return `Account does not exist on ${NETWORK}`;
    });
};
