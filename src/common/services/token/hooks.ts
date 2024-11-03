import { useEffect, useMemo } from "react";

import { pick } from "remeda";
import { useShallow } from "zustand/shallow";

import { refExchangeClient } from "@/common/contracts/ref-finance";

import { useFtMetadataStore } from "./models";

export const useSupportedFts = () => {
  const { data, error } = useFtMetadataStore(
    useShallow(pick(["data", "error"])),
  );

  const isLoading = useMemo(
    () => data === undefined && error === undefined,
    [data, error],
  );

  const { setData, setError } = useFtMetadataStore();

  useEffect(
    () =>
      void refExchangeClient
        .get_whitelisted_tokens()
        .then(setData)
        .catch(setError),
    [setData, setError],
  );

  return { isLoading, data, error };
};
