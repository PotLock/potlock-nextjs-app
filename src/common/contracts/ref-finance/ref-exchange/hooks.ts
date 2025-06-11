import useSWR from "swr";

import { IS_CLIENT } from "@/common/constants";
import type { ConditionalActivation } from "@/common/types";

import * as client from "./client";
import { CONTRACT_SWR_CONFIG } from "../../constants";

export const useWhitelistedTokens = ({ enabled = true }: ConditionalActivation | undefined = {}) =>
  useSWR(
    ["get_whitelisted_tokens"],
    () => (!enabled || !IS_CLIENT ? undefined : client.get_whitelisted_tokens()),
    CONTRACT_SWR_CONFIG,
  );
