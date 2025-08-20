import type { AccountView } from "near-api-js/lib/providers/provider";

import type { AccountId } from "@/common/types";

import { nearRpc } from "../client";

export const isNearAccountValid = async (account_id: AccountId) =>
  account_id.length > 4
    ? await nearRpc
        .query<AccountView>({
          request_type: "view_account",
          finality: "final",
          account_id,
        })
        .then(Boolean)
        .catch(() => false)
    : false;
