import useSWR from "swr";

import type { ByAccountId, ConditionalActivation } from "@/common/types";

import * as contractClient from "./client";

export const useSocialProfile = ({
  enabled = true,
  accountId,
}: ByAccountId & ConditionalActivation) =>
  useSWR(["useSocialProfile", accountId], ([_queryKey, account_id]) =>
    !enabled ? undefined : contractClient.getSocialProfile({ accountId: account_id }),
  );
