import { useMemo } from "react";

import { ByPotId } from "@/common/api/indexer";

import { usePotElections } from "./elections";

export const usePotExtensionFlags = ({ potId }: ByPotId) => {
  const { isLoading: isPotExtensionConfigLoading, potElections } = usePotElections({ potId });

  return useMemo(
    () => ({ isPotExtensionConfigLoading, hasVoting: (potElections?.length ?? 0) > 0 }),
    [isPotExtensionConfigLoading, potElections?.length],
  );
};
