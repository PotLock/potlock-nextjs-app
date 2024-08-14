import { useEffect, useState } from "react";

import { Pot } from "@/common/api/potlock";
import { usePots } from "@/common/api/potlock/hooks";

const useFilteredPots = () => {
  const { data: pots, isLoading } = usePots();
  const [activePots, setActivePots] = useState<Pot[]>([]);
  const [completedPots, setCompletedPots] = useState<Pot[]>([]);

  useEffect(() => {
    if (pots?.results) {
      const active = pots.results.filter((pot) => !pot.all_paid_out);
      setActivePots(active);
      const completed = pots.results.filter((pot) => pot.all_paid_out);
      setCompletedPots(completed);
    }
  }, [pots]);

  return {
    isLoading,
    pots,
    activePots,
    completedPots,
  };
};

export default useFilteredPots;
