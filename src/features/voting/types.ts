import { ByPotId } from "@/common/api/indexer";
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
  stakingContractAccountId?: TokenId;
  documentUrl?: string;
  voteWeightAmplificationRules: VotingWeightAmplificationRule[];
};
