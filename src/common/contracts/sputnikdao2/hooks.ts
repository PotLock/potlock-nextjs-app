import { pick } from "remeda";
import useSWR from "swr";

import { IS_CLIENT } from "@/common/constants";
import type { ByAccountId, ConditionalActivation } from "@/common/types";

import * as contractClient from "./client";

export const useProposals = ({
  enabled = true,
  accountId,
  ...params
}: ConditionalActivation & ByAccountId & contractClient.GetProposalsArgs) =>
  useSWR(["get_proposals", accountId, params], ([_queryKeyHead, accountIdKey, paramsKey]) =>
    !enabled || !IS_CLIENT
      ? undefined
      : contractClient.get_proposals({
          accountId: accountIdKey,
          args: pick(paramsKey, ["from_index", "limit"]),
        }),
  );
