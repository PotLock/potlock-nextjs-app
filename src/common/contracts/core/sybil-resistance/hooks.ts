import useSWR from "swr";

import { IS_CLIENT } from "@/common/constants";
import type { ByAccountId, ConditionalActivation } from "@/common/types";

import * as contractClient from "./client";

export const useIsHuman = ({ enabled = true, accountId }: ByAccountId & ConditionalActivation) =>
  useSWR(enabled && IS_CLIENT ? ["useIsHuman", accountId] : null, ([_queryKeyHead, accountIdKey]) =>
    contractClient.is_human({ account_id: accountIdKey }),
  );
