import { TokenId } from "@/common/types";

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

export type VotingMechanismConfig = {
  basicWeight: number;
  stakingTokenContractAccountId?: TokenId;
  documentUrl?: string;
  rules: VotingWeightAmplificationRule[];
};
