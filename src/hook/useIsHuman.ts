import { get_is_human } from "@app/services/contracts/sybil.nadabot";
import { useEffect, useState } from "react";

const useIsHuman = (accountId: string) => {
  const [nadaBotVerified, setNadaBotVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchHumanStatus = async () => {
      try {
        const isHuman = await get_is_human({ account_id: accountId });
        setNadaBotVerified(isHuman);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    };
    fetchHumanStatus();
  }, []);

  return {
    nadaBotVerified,
    loading,
    error,
  };
};

export default useIsHuman;
