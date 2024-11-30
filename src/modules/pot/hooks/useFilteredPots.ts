import { useEffect, useState } from "react";

import { Pot, indexer } from "@/common/api/indexer";

const useFilteredPots = () => {
  const { data: pots, isLoading } = indexer.usePots({ page_size: 200 });
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
