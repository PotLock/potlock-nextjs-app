import { useEffect, useState } from "react";

import { AccountId } from "@/common/types";

import * as contract from "./client";

export const useWhitelistedTokens = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AccountId[] | undefined>();
  const [error, setError] = useState<unknown>(null);

  useEffect(
    () =>
      void contract
        .get_whitelisted_tokens()
        .then(setData)
        .catch(setError)
        .finally(() => setIsLoading(false)),
    [],
  );

  return { isLoading, data, error };
};
