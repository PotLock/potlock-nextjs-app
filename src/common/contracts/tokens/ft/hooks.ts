import useSWR from "swr";

import { IS_CLIENT } from "@/common/constants";
import type { ByAccountId, ByTokenId, WithDisabled } from "@/common/types";

import * as ftClient from "./client";

// TODO: Use conventional `enabled` instead of `disabled`
export const useFtMetadata = ({ disabled = false, ...params }: ByTokenId & WithDisabled) =>
  useSWR(
    () => (disabled || !IS_CLIENT ? null : ["ft_metadata", params.tokenId]),
    ([_queryKeyHead, tokenId]) => ftClient.ft_metadata({ tokenId }).catch(() => undefined),
  );

// TODO: Use conventional `enabled` instead of `disabled`
export const useFtBalanceOf = ({
  disabled = false,
  ...params
}: ByAccountId & ByTokenId & WithDisabled) =>
  useSWR(
    () => (disabled || !IS_CLIENT ? null : ["ft_balance_of", params.accountId, params.tokenId]),

    ([_queryKeyHead, accountId, tokenId]) =>
      ftClient.ft_balance_of({ accountId, tokenId }).catch(() => undefined),
  );
