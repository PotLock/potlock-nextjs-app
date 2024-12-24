import { useMemo } from "react";

import { ByPotId } from "@/common/api/indexer";

import { usePotElections } from "./elections";

export const usePotExtensionFlags = ({ potId }: ByPotId) => {
  const { isLoading: isPotExtensionConfigLoading, elections } = usePotElections({ potId });

  return useMemo(
    () => ({ isPotExtensionConfigLoading, hasVoting: (elections?.length ?? 0) > 0 }),
    [isPotExtensionConfigLoading, elections?.length],
  );
};
