import useSWR from "swr";

import { ByAccountId } from "@/common/types";

import { CLIENT_CONFIG, client } from "./client";

export const useAccountFollowers = ({ accountId }: Partial<ByAccountId>) =>
  useSWR(
    "/keys",

    (url) => {
      if (accountId) {
        return client
          .post(url, {
            keys: [`*/graph/follow/${accountId}`],
            options: { return_type: "BlockHeight", values_only: true },
          })
          .then((response) => response.data);
      }
    },

    CLIENT_CONFIG.swr,
  );
