import { useEffect, useState } from "react";

import { getIsHuman } from "@/common/contracts/core/sybil";

export const useIsHuman = (accountId?: string) => {
  const [isHumanVerified, setNadaBotVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchHumanStatus = async () => {
      try {
        const isHuman = await getIsHuman({ account_id: accountId || "" });
        setNadaBotVerified(isHuman);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    };

    if (accountId) {
      fetchHumanStatus();
    }
  }, [accountId]);

  return {
    isHumanVerified,
    loading,
    error,
  };
};
