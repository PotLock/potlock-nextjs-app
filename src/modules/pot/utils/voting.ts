import { ByPotId } from "@/common/api/indexer";
import { STAKE_WEIGHTED_POT_IDS } from "@/common/constants";

export const isPotVotingBased = ({ potId }: ByPotId) => STAKE_WEIGHTED_POT_IDS.includes(potId);
