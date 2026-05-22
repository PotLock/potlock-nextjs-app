import type { AccountView } from "near-api-js/lib/providers/provider";

import type { AccountId } from "@/common/types";

import { nearRpc } from "../client";

const accountValidationCache = new Map<string, boolean>();
let lastValidationTimestamp = 0;
const DEBOUNCE_MS = 300;

export const isNearAccountValid = async (account_id: AccountId) => {
  if (account_id.length <= 4) return false;

  const cached = accountValidationCache.get(account_id);
  if (cached !== undefined) return cached;

  // Debounce: wait before making RPC call, skip if a newer call arrives
  const timestamp = Date.now();
  lastValidationTimestamp = timestamp;
  await new Promise((resolve) => setTimeout(resolve, DEBOUNCE_MS));
  if (lastValidationTimestamp !== timestamp) return false;

  const isValid = await nearRpc
    .query<AccountView>({
      request_type: "view_account",
      finality: "final",
      account_id,
    })
    .then(Boolean)
    .catch(() => false);

  accountValidationCache.set(account_id, isValid);
  return isValid;
};
