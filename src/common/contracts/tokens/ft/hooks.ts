import type { AccountView } from "near-api-js/lib/providers/provider";
import { prop } from "remeda";
import useSWR from "swr";

import { nearClient } from "@/common/api/near";
import { NATIVE_TOKEN_DECIMALS, NATIVE_TOKEN_ICON_URL, NATIVE_TOKEN_ID } from "@/common/constants";
import { isAccountId } from "@/common/lib";
import type { AccountId, ByAccountId, ByTokenId, TokenId, WithDisabled } from "@/common/types";

import * as ftClient from "./client";

export const useFtMetadata = ({ tokenId, disabled = false }: ByTokenId & WithDisabled) =>
  useSWR(
    ["ft_metadata", tokenId, disabled],

    ([_queryKey, tokenId, isDisabled]: [string, TokenId, boolean]) => {
      if (isDisabled) {
        return undefined;
      } else {
        switch (tokenId) {
          case NATIVE_TOKEN_ID: {
            return {
              spec: "",
              name: NATIVE_TOKEN_ID,
              symbol: NATIVE_TOKEN_ID.toUpperCase(),
              icon: NATIVE_TOKEN_ICON_URL,
              reference: null,
              reference_hash: null,
              decimals: NATIVE_TOKEN_DECIMALS,
            };
          }

          default: {
            if (isAccountId(tokenId)) {
              return ftClient.ft_metadata({ tokenId }).catch(() => undefined);
            } else return undefined;
          }
        }
      }
    },
  );

export const useFtBalanceOf = ({
  accountId,
  tokenId,
  disabled = false,
}: ByAccountId & ByTokenId & WithDisabled) =>
  useSWR(
    ["ft_balance_of", accountId, tokenId, disabled],

    ([_queryKey, accountId, tokenId, isDisabled]: [string, AccountId, TokenId, boolean]) => {
      if (isDisabled) {
        return undefined;
      } else if (isAccountId(accountId)) {
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
      } else return undefined;
    },
  );
