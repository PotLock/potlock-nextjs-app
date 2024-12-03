import { ByPotId } from "@/common/api/indexer";
import { VOTING_BASED_POT_IDS } from "@/common/constants";

export const isVotingEnabled = ({ potId }: ByPotId) => VOTING_BASED_POT_IDS.includes(potId);
