import { useMemo } from "react";

import { ByPotId } from "@/common/api/indexer";
import { votingContractHooks } from "@/common/contracts/core/voting";

export const usePotFeatureFlags = ({ potId }: ByPotId) => {
  const { isLoading: isPotExtensionConfigLoading, data: elections } =
    votingContractHooks.usePotElections({
      potId,
    });

  return useMemo(
    () => ({
      isPotExtensionConfigLoading,
      hasPFMechanism: (elections?.length ?? 0) > 0,
    }),

    [isPotExtensionConfigLoading, elections?.length],
  );
};
