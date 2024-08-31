import { useEffect, useState } from "react";

import { Pot, potlock } from "@/common/api/potlock";

const useFilteredPots = () => {
  const { data: pots, isLoading } = potlock.usePots();
  const [activePots, setActivePots] = useState<Pot[]>([]);
  const [completedPots, setCompletedPots] = useState<Pot[]>([]);

  useEffect(() => {
    if (pots?.results) {
      const active = pots.results.filter((pot) => !pot.all_paid_out);
      setActivePots(active);
      const completed = pots.results.filter((pot) => pot.all_paid_out);
      setCompletedPots(completed);
    }
  }, [pots, pots?.count]);

  return {
    isLoading,
    pots,
    activePots,
    completedPots,
  };
};

export default useFilteredPots;
