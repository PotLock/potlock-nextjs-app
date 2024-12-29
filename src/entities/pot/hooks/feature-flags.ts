import { useMemo } from "react";

import { ByPotId } from "@/common/api/indexer";
import { votingContractHooks } from "@/common/contracts/core/voting";

export const usePotFeatureFlags = ({ potId }: ByPotId) => {
  const { isLoading: isPotExtensionConfigLoading, elections } = votingContractHooks.usePotElections(
    {
      potId,
    },
  );

  return useMemo(
    () => ({
      isPotExtensionConfigLoading,
      hasProportionalFundingMechanism: (elections?.length ?? 0) > 0,
    }),
    [isPotExtensionConfigLoading, elections?.length],
  );
};
