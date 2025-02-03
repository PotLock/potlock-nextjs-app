import type { AccountView } from "near-api-js/lib/providers/provider";
import useSWR from "swr";

import { NATIVE_TOKEN_DECIMALS, NATIVE_TOKEN_ICON_URL, NATIVE_TOKEN_ID } from "@/common/constants";
import type { ByAccountId, WithDisabled } from "@/common/types";

import { nearRpc } from "./client";

export type NativeTokenMetadata = {
  name: string;
  symbol: string;
  icon: string | null;
  decimals: number;
};

export const useNativeTokenMetadata = ({ disabled = false }: WithDisabled) =>
  useSWR(
    () => (disabled ? null : ["NativeTokenMetadata", NATIVE_TOKEN_ID]),

    (_queryKeyHead) =>
      new Promise<NativeTokenMetadata>((resolve) =>
        resolve({
          name: NATIVE_TOKEN_ID,
          symbol: NATIVE_TOKEN_ID.toUpperCase(),
          icon: NATIVE_TOKEN_ICON_URL,
          decimals: NATIVE_TOKEN_DECIMALS,
        }),
      ),
  );

export const useViewAccount = ({ disabled = false, ...params }: ByAccountId & WithDisabled) =>
  useSWR(
    () => (disabled ? null : ["view_account", params.accountId]),

    ([_queryKeyHead, accountId]) =>
      nearRpc
        .query<AccountView>({
          request_type: "view_account",
          account_id: accountId,
          finality: "final",
        })
        .catch(() => undefined),
  );
