import useSWR from "swr";

import { CONTRACT_SWR_CONFIG, IS_CLIENT } from "@/common/constants";
import type { ConditionalActivation } from "@/common/types";

import * as client from "./client";

export const useWhitelistedTokens = ({ enabled = true }: ConditionalActivation | undefined = {}) =>
  useSWR(
    () => (enabled ? ["get_whitelisted_tokens"] : null),
    () => (!IS_CLIENT ? undefined : client.get_whitelisted_tokens()),
    CONTRACT_SWR_CONFIG,
  );
