import useSWR from "swr";

import type { ByAccountId, ByListId, ConditionalActivation } from "@/common/types";

import * as contractClient from "./client";

export const useIsRegistered = ({
  enabled = true,
  accountId,
  listId,
  ...params
}: ByAccountId &
  ByListId &
  Pick<contractClient.IsRegisteredArgs, "required_status"> &
  ConditionalActivation) =>
  useSWR(
    ["useIsRegistered", accountId, listId, params],
    ([_queryKey, accountIdKey, listIdKey, paramsKey]) =>
      !enabled
        ? undefined
        : contractClient.is_registered({
            account_id: accountIdKey,
            list_id: listIdKey,
            ...paramsKey,
          }),
  );

export const useRegistration = ({
  enabled = true,
  accountId,
  listId,
}: ByAccountId & ByListId & ConditionalActivation) =>
  useSWR(["useRegistration", accountId, listId], ([_queryKey, accountIdKey, listIdKey]) =>
    !enabled
      ? undefined
      : contractClient.getRegistration({ registrant_id: accountIdKey, list_id: listIdKey }),
  );
