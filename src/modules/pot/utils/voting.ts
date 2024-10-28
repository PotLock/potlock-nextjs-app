import { ByPotId } from "@/common/api/indexer";

import { STAKE_WEIGHTED_POT_IDS } from "../constants";

export const isPotStakeWeighted = ({ potId }: ByPotId) =>
  STAKE_WEIGHTED_POT_IDS.includes(potId);
