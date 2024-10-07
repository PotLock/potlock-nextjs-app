import { ByPotId } from "@/common/api/potlock";

import { STAKE_WEIGHTED_POT_IDS } from "../constants";

export const isPotStakeWeighted = ({ potId }: ByPotId) =>
  STAKE_WEIGHTED_POT_IDS.includes(potId);
