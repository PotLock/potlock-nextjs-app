import useSWR from "swr";

import { IS_CLIENT } from "@/common/constants";
import type {
  ByAccountId,
  ByTokenId,
  ConditionalActivation,
  LiveUpdateParams,
} from "@/common/types";

import * as ftContractClient from "./client";

export const useFtMetadata = ({
  enabled = true,
  live = false,
  ...params
}: ByTokenId & ConditionalActivation & LiveUpdateParams) =>
  useSWR(
    () => (!enabled || !IS_CLIENT ? null : ["ft_metadata", params.tokenId]),
    ([_queryKeyHead, tokenId]) => ftContractClient.ft_metadata({ tokenId }).catch(() => undefined),

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

export const useFtBalanceOf = ({
  enabled = true,
  live = false,
  ...params
}: ByAccountId & ByTokenId & ConditionalActivation & LiveUpdateParams) =>
  useSWR(
    () => (!enabled || !IS_CLIENT ? null : ["ft_balance_of", params.accountId, params.tokenId]),

    ([_queryKeyHead, accountId, tokenId]) =>
      ftContractClient.ft_balance_of({ accountId, tokenId }).catch(() => undefined),

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
