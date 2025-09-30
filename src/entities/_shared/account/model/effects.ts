import { AccountView } from "near-api-js/lib/providers/provider";

import { NETWORK } from "@/common/_config";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { nearProtocolSchemas } from "@/common/blockchains/near-protocol";
import { nearRpc } from "@/common/blockchains/near-protocol/client";

/**
 * @deprecated use {@link nearProtocolSchemas.validAccountId} for form field validation instead!
 */
export const validateAccountId = (accountId: string): Promise<string | undefined> => {
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
