import { AxiosResponse } from "axios";
import useSWR from "swr";

import { AccountId, ByAccountId, type ConditionalActivation } from "@/common/types";

import { CLIENT_CONFIG, nearSocialClient, nearSocialIndexerClient } from "./client";

export const useFollowerAccountIds = ({
  enabled = true,
  accountId,
}: ByAccountId & ConditionalActivation) =>
  useSWR(
    [`*/graph/follow/${accountId}`],

    (keys) =>
      !enabled
        ? undefined
        : nearSocialClient.keys({ keys, valuesOnly: true }).then((result) => Object.keys(result)),

    CLIENT_CONFIG.swr,
  );

export const useFollowedAccountIds = ({
  enabled = true,
  accountId,
}: ByAccountId & ConditionalActivation) =>
  useSWR(
    ["useFollowedAccountIds", "/keys"],

    ([_queryKeyHead, urlKey]) =>
      !enabled
        ? undefined
        : nearSocialIndexerClient
            .post(urlKey, {
              keys: [`${accountId}/graph/follow/*`],
              options: { values_only: true },
            })
            .then(
              (
                response: AxiosResponse<{
                  [key: AccountId]: {
                    graph: { follow: { [key: AccountId]: boolean } };
                  };
                }>,
              ) => Object.keys(response.data[accountId].graph.follow),
            ),

    CLIENT_CONFIG.swr,
  );
