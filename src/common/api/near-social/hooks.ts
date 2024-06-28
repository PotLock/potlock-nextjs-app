import { AxiosResponse } from "axios";
import useSWR, { SWRResponse } from "swr";

import { AccountId, ByAccountId } from "@/common/types";

import { CLIENT_CONFIG, client } from "./client";

export const useFollowerAccountIds = ({
  accountId,
}: Partial<ByAccountId>): SWRResponse<AccountId[] | undefined> =>
  useSWR(
    ["/keys", "followers"],

    ([url]) => {
      if (accountId) {
        return client
          .post(url, {
            keys: [`*/graph/follow/${accountId}`],
            options: { values_only: true },
          })
          .then(
            (
              response: AxiosResponse<
                Record<
                  AccountId,
                  { graph: { follow: { [key: AccountId]: boolean } } }
                >
              >,
            ) => Object.keys(response.data),
          );
      }
    },

    CLIENT_CONFIG.swr,
  );

export const useFollowedAccountIds = ({
  accountId,
}: Partial<ByAccountId>): SWRResponse<AccountId[] | undefined> =>
  useSWR(
    ["/keys", "followed"],

    ([url]) => {
      if (accountId) {
        return client
          .post(url, {
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
          );
      }
    },

    CLIENT_CONFIG.swr,
  );
