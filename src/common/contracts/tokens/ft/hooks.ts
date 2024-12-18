import type { AccountView } from "near-api-js/lib/providers/provider";
import { prop } from "remeda";
import useSWR from "swr";

import { nearClient } from "@/common/api/near";
import { NATIVE_TOKEN_DECIMALS, NATIVE_TOKEN_ICON_URL, NATIVE_TOKEN_ID } from "@/common/constants";
import { isAccountId } from "@/common/lib";
import type { ByAccountId, ByTokenId, WithDisabled } from "@/common/types";

import * as ftClient from "./client";
import type { FungibleTokenMetadata } from "./interfaces";

export const useFtMetadata = ({ disabled = false, ...params }: ByTokenId & WithDisabled) =>
  useSWR(
    () => (disabled ? null : ["ft_metadata", params.tokenId]),

    ([_queryKey, tokenId]) => {
      switch (tokenId) {
        case NATIVE_TOKEN_ID: {
          return new Promise<FungibleTokenMetadata>((resolve) =>
            resolve({
              spec: "",
              name: NATIVE_TOKEN_ID,
              symbol: NATIVE_TOKEN_ID.toUpperCase(),
              icon: NATIVE_TOKEN_ICON_URL,
              reference: null,
              reference_hash: null,
              decimals: NATIVE_TOKEN_DECIMALS,
            }),
          );
        }

        default: {
          if (isAccountId(tokenId)) {
            return ftClient.ft_metadata({ tokenId }).catch(() => undefined);
          } else return undefined;
        }
      }
    },
  );

export const useFtBalanceOf = ({
  disabled = false,
  ...params
}: ByAccountId & ByTokenId & WithDisabled) =>
  useSWR(
    () => (disabled ? null : ["ft_balance_of", params.accountId, params.tokenId]),

    ([_queryKey, accountId, tokenId]) => {
      switch (tokenId) {
        case NATIVE_TOKEN_ID: {
          return nearClient.nearRpc
            .query<AccountView>({
              request_type: "view_account",
              account_id: accountId,
              finality: "final",
            })
            .then(prop("amount"))
            .catch(() => undefined);
        }

        default: {
          if (isAccountId(tokenId)) {
            return ftClient.ft_balance_of({ accountId, tokenId }).catch(() => undefined);
          } else return undefined;
        }
      }
    },
  );
