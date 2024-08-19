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
