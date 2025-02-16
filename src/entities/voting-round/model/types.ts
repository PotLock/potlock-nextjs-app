import type { AccountId } from "@/common/types";
import type { TokenData } from "@/entities/_shared";

import type { VotingRoundVoterSummary, VotingRoundWinner } from "../types";

export type VotingRoundParticipants = {
  voters: Record<AccountId, VotingRoundVoterSummary>;
  winners: Record<AccountId, VotingRoundWinner>;
};

export type VotingRoundElectionResult = VotingRoundParticipants & {
  totalVoteCount: number;
  payoutTokenMetadata: TokenData["metadata"];
};
