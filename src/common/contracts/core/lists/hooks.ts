import useSWR from "swr";

import { IS_CLIENT } from "@/common/constants";
import type {
  ByAccountId,
  ByListId,
  ConditionalActivation,
  LiveUpdateParams,
} from "@/common/types";

import * as contractClient from "./client";

export const useList = ({ enabled = true, listId }: ByListId & ConditionalActivation) =>
  useSWR(enabled && IS_CLIENT ? ["useList", listId] : null, ([_queryKeyHead, listIdKey]) =>
    contractClient.get_list({ list_id: listIdKey }),
  );

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
    enabled && IS_CLIENT ? ["useIsRegistered", accountId, listId, params] : null,
    ([_queryKeyHead, accountIdKey, listIdKey, paramsKey]) =>
      contractClient.is_registered({ account_id: accountIdKey, list_id: listIdKey, ...paramsKey }),
  );

export const useRegistrations = ({
  enabled = true,
  listId,
  ...params
}: ByListId &
  Omit<contractClient.GetRegistrationsForListArgs, "list_id"> &
  ConditionalActivation) =>
  useSWR(
    enabled && IS_CLIENT ? ["useRegistrations", listId, params] : null,
    ([_queryKeyHead, listIdKey, paramsKey]) =>
      contractClient.get_registrations_for_list({ list_id: listIdKey, ...paramsKey }),
  );

export const useRegistration = ({
  enabled = true,
  live = false,
  accountId,
  listId,
}: ByAccountId & ByListId & ConditionalActivation & LiveUpdateParams) =>
  useSWR(
    enabled && IS_CLIENT ? ["useRegistration", accountId, listId] : null,
    ([_queryKeyHead, accountIdKey, listIdKey]) =>
      contractClient.getRegistration({ registrant_id: accountIdKey, list_id: listIdKey }),

    live
      ? {}
      : {
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
        },
  );
