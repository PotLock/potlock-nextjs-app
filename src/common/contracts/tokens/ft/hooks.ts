import useSWR from "swr";

import { NATIVE_TOKEN_DECIMALS, NATIVE_TOKEN_ICON_URL, NATIVE_TOKEN_ID } from "@/common/constants";
import { isAccountId } from "@/common/lib";
import type { AccountId, ByAccountId, ByTokenId, TokenId } from "@/common/types";

import * as ftClient from "./client";

export const useFtMetadata = ({ tokenId }: ByTokenId) =>
  useSWR(
    ["ft_metadata", tokenId],

    ([_queryKey, tokenId]: [string, TokenId]) =>
      tokenId === NATIVE_TOKEN_ID
        ? {
            spec: "",
            name: NATIVE_TOKEN_ID,
            symbol: NATIVE_TOKEN_ID.toUpperCase(),
            icon: NATIVE_TOKEN_ICON_URL,
            reference: null,
            reference_hash: null,
            decimals: NATIVE_TOKEN_DECIMALS,
          }
        : ftClient.ft_metadata({ tokenId }),
  );

export const useFtBalanceOf = ({ accountId, tokenId }: Partial<ByAccountId> & ByTokenId) =>
  useSWR(
    ["ft_balance_of", accountId, tokenId],

    ([_queryKey, accountId, tokenId]: [string, AccountId | undefined, TokenId]) => {
      return typeof accountId === "string" && isAccountId(accountId)
        ? ftClient.ft_balance_of({ accountId, tokenId })
        : undefined;
    },
  );
