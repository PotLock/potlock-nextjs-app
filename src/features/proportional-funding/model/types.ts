import type { ByPotId } from "@/common/api/indexer";
import type { AccountId } from "@/common/types";
import type { VotingRoundElectionResult } from "@/entities/voting-round";

export type PFPayoutJustificationInputs = ByPotId & {
  votingRoundResult: VotingRoundElectionResult;
  challengerAccountId: AccountId;
};

export type PFPayoutJustificationV1 = VotingRoundElectionResult;
