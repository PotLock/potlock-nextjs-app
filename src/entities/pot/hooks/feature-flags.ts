import { useMemo } from "react";

import { ByPotId } from "@/common/api/indexer";
import { votingHooks } from "@/common/contracts/core/voting";

export const usePotFeatureFlags = ({ potId }: ByPotId) => {
  const { isLoading: isPotExtensionConfigLoading, elections } = votingHooks.usePotElections({
    potId,
  });

  return useMemo(
    () => ({ isPotExtensionConfigLoading, hasVoting: (elections?.length ?? 0) > 0 }),
    [isPotExtensionConfigLoading, elections?.length],
  );
};
