import { useMemo } from "react";

import { ByPotId } from "@/common/api/indexer";

import { usePotElections } from "./elections";

export const usePotExtensionFlags = ({ potId }: ByPotId) => {
  const { potElections } = usePotElections({ potId });

  return useMemo(() => ({ hasVoting: (potElections?.length ?? 0) > 0 }), [potElections]);
};
