import { useEffect, useState } from "react";

import { AccountId } from "@/common/types";

import * as contract from "./client";

export const useWhitelistedTokens = () => {
  const [data, setData] = useState<AccountId[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void contract.get_whitelisted_tokens().then((ftContractAccountIds) => {
      setData(ftContractAccountIds);
      setIsLoading(false);
    });
  }, []);

  return { isLoading, data };
};
