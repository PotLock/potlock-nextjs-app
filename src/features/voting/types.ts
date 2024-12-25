import { ByPotId } from "@/common/api/indexer";
import type { ByElectionId, Election } from "@/common/contracts/core/voting";
import { ByAccountId, TokenId } from "@/common/types";

export type VotingParticipantKey = Partial<ByAccountId> & ByPotId;

export type VotingParticipantStats = {
  isHumanVerified: boolean;
  stakingTokenBalance?: Big.Big;
  stakingTokenBalanceUsd?: Big.Big;
  votingPower: Big.Big;
};

export type VotingSupportedNumericComparatorKey = keyof Big.Big & ("lt" | "lte" | "gt" | "gte");

export type VotingWeightAmplificationRule = {
  name: string;
  description: string;
  participantStatsPropertyKey: keyof VotingParticipantStats;
  amplificationPercent: number;
} & (
  | { comparator: VotingSupportedNumericComparatorKey; threshold: number }
  | { comparator: "isTruthy"; expectation: boolean }
);

export type VotingVoteWeightAmplifier = Pick<
  VotingWeightAmplificationRule,
  "name" | "description" | "amplificationPercent"
> & {
  isApplicable: boolean;
};

export type VotingMechanismConfig = {
  initialWeight: number;
  basicWeight?: number;
  stakingContractAccountId?: TokenId;
  documentUrl?: string;
  voteWeightAmplificationRules: VotingWeightAmplificationRule[];
};

export type VotingCandidateFilter = "all" | "voted" | "pending";

export type VotingRound = ByElectionId & { election: Election };

export type VotingRoundKey = ByPotId;
