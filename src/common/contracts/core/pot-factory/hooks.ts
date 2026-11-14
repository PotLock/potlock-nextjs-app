import useSWR from "swr";

import { IS_CLIENT } from "@/common/constants";
import type { ConditionalActivation } from "@/common/types";

import * as contractClient from "./client";

export const useConfig = ({ enabled = true }: ConditionalActivation | undefined = {}) =>
  useSWR(
    () => (enabled ? ["useConfig"] : null),
    ([_queryKeyHead]) => (!IS_CLIENT ? undefined : contractClient.get_config()),
  );
