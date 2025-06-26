import useSWR from "swr";

import { IS_CLIENT } from "@/common/constants";
import type { ByAccountId, ConditionalActivation, LiveUpdateParams } from "@/common/types";

import * as contractClient from "./client";

export const useSocialProfile = ({
  enabled = true,
  live = false,
  accountId,
}: ByAccountId & ConditionalActivation & LiveUpdateParams) =>
  useSWR(
    ["useSocialProfile", accountId],

    ([_queryKeyHead, account_id]) =>
      !enabled || !IS_CLIENT
        ? undefined
        : contractClient
            .getSocialProfile({ accountId: account_id })
            //* Handling `null` response
            .then((response) => response ?? undefined),

    {
      ...(live
        ? {}
        : {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnMount: false,
            revalidateOnReconnect: false,
          }),
    },
  );
