import useSWR from "swr";

import { IS_CLIENT } from "@/common/constants";
import type { ByAccountId, ConditionalActivation } from "@/common/types";

import * as contractClient from "./client";

export const useSocialProfile = ({
  enabled = true,
  accountId,
}: ByAccountId & ConditionalActivation) =>
  useSWR(["useSocialProfile", accountId], ([_queryKeyHead, account_id]) =>
    !enabled || !IS_CLIENT
      ? undefined
      : contractClient
          .getSocialProfile({ accountId: account_id })
          //* Handling `null` response
          .then((response) => response ?? undefined),
  );
