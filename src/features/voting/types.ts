import { ByPotId } from "@/common/api/indexer";
import type { ByElectionId, Election } from "@/common/contracts/core/voting";
import { ByAccountId, TokenId } from "@/common/types";

export type VoterKey = Partial<ByAccountId> & ByPotId;

export type VoterProfile = {
  isHumanVerified: boolean;
  stakingTokenBalance?: Big.Big;
  stakingTokenBalanceUsd?: Big.Big;
  votingPower: Big.Big;
};

export enum VotingWeightAmplificationCriteriaEnum {
  KYC = "KYC",
  VotingPower = "Voting Power",
  Staking = "Staking",
}

export type VotingWeightAmplificationCriteria = keyof typeof VotingWeightAmplificationCriteriaEnum;

export type VotingSupportedNumericComparatorKey = keyof Big.Big & ("lt" | "lte" | "gt" | "gte");

export type VotingWeightAmplificationRule = {
  name: string;
  description: string;
  criteria: VotingWeightAmplificationCriteria;
  voterProfileParameter: keyof VoterProfile;
  amplificationPercent: number;
} & (
  | { comparator: VotingSupportedNumericComparatorKey; threshold: number }
  | { comparator: "isTruthy"; expectation: boolean }
);

export type VotingVoteWeightAmplifier = Pick<
  VotingWeightAmplificationRule,
  "name" | "description" | "criteria" | "amplificationPercent"
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

export type VotingRoundCandidateResult = ByAccountId & {
  accumulatedWeight: number;
  estimatedPayoutAmount: number;
};
