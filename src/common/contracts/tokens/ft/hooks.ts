import useSWR from "swr";

import type { ByAccountId, ByTokenId, WithDisabled } from "@/common/types";

import * as ftClient from "./client";

export const useFtMetadata = ({ disabled = false, ...params }: ByTokenId & WithDisabled) =>
  useSWR(
    () => (disabled ? null : ["ft_metadata", params.tokenId]),
    ([_queryKey, tokenId]) => ftClient.ft_metadata({ tokenId }).catch(() => undefined),
  );

export const useFtBalanceOf = ({
  disabled = false,
  ...params
}: ByAccountId & ByTokenId & WithDisabled) =>
  useSWR(
    () => (disabled ? null : ["ft_balance_of", params.accountId, params.tokenId]),

    ([_queryKey, accountId, tokenId]) =>
      ftClient.ft_balance_of({ accountId, tokenId }).catch(() => undefined),
  );
