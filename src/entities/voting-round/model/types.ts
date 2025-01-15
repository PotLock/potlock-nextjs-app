import type { AccountId } from "@/common/types";

import type { VotingRoundVoterSummary, VotingRoundWinner } from "../types";

export type VotingRoundParticipants = {
  voters: Record<AccountId, VotingRoundVoterSummary>;
  winners: Record<AccountId, VotingRoundWinner>;
};
