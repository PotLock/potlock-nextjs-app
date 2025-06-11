import useSWR from "swr";

import { CONTRACT_SWR_CONFIG, IS_CLIENT } from "@/common/constants";
import type { ByAccountId, ByTokenId, WithDisabled } from "@/common/types";

import * as ftContractClient from "./client";

// TODO: Use conventional `enabled` instead of `disabled`
export const useFtMetadata = ({ disabled = false, ...params }: ByTokenId & WithDisabled) =>
  useSWR(
    () => (disabled || !IS_CLIENT ? null : ["ft_metadata", params.tokenId]),
    ([_queryKeyHead, tokenId]) => ftContractClient.ft_metadata({ tokenId }).catch(() => undefined),
    CONTRACT_SWR_CONFIG,
  );

// TODO: Use conventional `enabled` instead of `disabled`
export const useFtBalanceOf = ({
  disabled = false,
  ...params
}: ByAccountId & ByTokenId & WithDisabled) =>
  useSWR(
    () => (disabled || !IS_CLIENT ? null : ["ft_balance_of", params.accountId, params.tokenId]),

    ([_queryKeyHead, accountId, tokenId]) =>
      ftContractClient.ft_balance_of({ accountId, tokenId }).catch(() => undefined),

    CONTRACT_SWR_CONFIG,
  );
