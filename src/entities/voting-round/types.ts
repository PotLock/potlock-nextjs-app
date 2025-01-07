import { ByPotId } from "@/common/api/indexer";
import type { ByElectionId, Election } from "@/common/contracts/core/voting";
import type { NumericComparatorKey } from "@/common/lib";
import { ByAccountId, TokenId } from "@/common/types";

export type VotingRoundVoterKey = Partial<ByAccountId> & ByPotId;

export type VoterProfile = ByAccountId & {
  isHumanVerified: boolean;
  stakingTokenBalance?: Big.Big;
  stakingTokenBalanceUsd?: Big.Big;
  votingPower: Big.Big;
};

export enum VotingRoundVoteWeightAmplificationCriteriaEnum {
  KYC = "KYC",
  VotingPower = "Voting Power",
  Staking = "Staking",
}

export type VotingRoundVoteWeightAmplificationCriteria =
  keyof typeof VotingRoundVoteWeightAmplificationCriteriaEnum;

export type VotingRoundVoteWeightAmplificationRule = {
  name: string;
  description: string;
  criteria: VotingRoundVoteWeightAmplificationCriteria;
  voterProfileParameter: keyof VoterProfile;
  amplificationPercent: number;
} & (
  | { comparator: NumericComparatorKey; threshold: number }
  | { comparator: "boolean"; expectation: boolean }
);

export type VotingRoundVoteWeightAmplifier = Pick<
  VotingRoundVoteWeightAmplificationRule,
  "name" | "description" | "criteria" | "amplificationPercent"
> & {
  isApplicable: boolean;
};

export type VotingMechanismConfig = {
  initialWeight: number;
  basicWeight?: number;
  stakingContractAccountId?: TokenId;
  documentUrl?: string;
  voteWeightAmplificationRules: VotingRoundVoteWeightAmplificationRule[];
};

export type VotingRoundCandidateFilter = "all" | "voted" | "pending";

export type VotingRound = ByElectionId & { election: Election };

export type VotingRoundKey = ByPotId;

export type VotingRoundVoterSummary = ByAccountId & {
  vote: { weight: number; amplifiers: VotingRoundVoteWeightAmplifier[] };
};

export type VotingRoundWinner = ByAccountId & {
  voteCount: number;
  accumulatedWeight: number;
  estimatedPayoutAmount: number;
};
