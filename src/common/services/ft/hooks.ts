import { useMemo } from "react";

import { pick } from "remeda";
import { useShallow } from "zustand/shallow";

import { useFtRegistryStore } from "./models";

export const useSupportedTokens = () => {
  const { data, error } = useFtRegistryStore(
    useShallow(pick(["data", "error"])),
  );

  const isLoading = useMemo(
    () => data === undefined && error === undefined,
    [data, error],
  );

  return { isLoading, data, error };
};
