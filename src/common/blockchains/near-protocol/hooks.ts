import type { AccountView } from "near-api-js/lib/providers/provider";
import useSWR from "swr";

import {
  CONTRACT_SWR_CONFIG,
  IS_CLIENT,
  NATIVE_TOKEN_DECIMALS,
  NATIVE_TOKEN_ICON_URL,
  NATIVE_TOKEN_ID,
} from "@/common/constants";
import type { ByAccountId, ConditionalActivation, LiveUpdateParams } from "@/common/types";

import { nearRpc } from "./client";

export type NativeTokenMetadata = {
  name: string;
  symbol: string;
  icon: string | null;
  decimals: number;
};

export const useNativeTokenMetadata = ({ enabled = true }: ConditionalActivation) =>
  useSWR(
    () => (!enabled ? null : ["NativeTokenMetadata", NATIVE_TOKEN_ID]),

    (_queryKeyHead) =>
      new Promise<NativeTokenMetadata>((resolve) =>
        resolve({
          name: NATIVE_TOKEN_ID,
          symbol: NATIVE_TOKEN_ID.toUpperCase(),
          icon: NATIVE_TOKEN_ICON_URL,
          decimals: NATIVE_TOKEN_DECIMALS,
        }),
      ),

    CONTRACT_SWR_CONFIG,
  );

export const useViewAccount = ({
  enabled = true,
  live = false,
  ...params
}: ByAccountId & ConditionalActivation & LiveUpdateParams) =>
  useSWR(
    () => (!enabled || !IS_CLIENT ? null : ["view_account", params.accountId]),

    ([_queryKeyHead, accountId]) =>
      nearRpc
        .query<AccountView>({
          request_type: "view_account",
          account_id: accountId,
          finality: "final",
        })
        .catch(() => undefined),

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
