import { ENV_TAG, METAPOOL_LIQUID_STAKING_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { EnvTag } from "@/common/_config/env";
import { ByPotId, PotId } from "@/common/api/indexer";

import { VotingMechanismConfig } from "../types";

const VOTING_SUPPORTED_POT_IDS_BY_ENV: Record<EnvTag, PotId[]> = {
  production: ["mpdao.v1.potfactory.potlock.near"],
  staging: ["mpdao-retropgf.potfactory.staging.potlock.near"],
  test: [],
};

export const VOTING_SUPPORTED_POT_IDS = VOTING_SUPPORTED_POT_IDS_BY_ENV[ENV_TAG];

// TODO: Convert into publicly available configurable JSON ( Pots V2 milestone ) and validate with Zod
export const VOTING_MECHANISM_CONFIG_MPDAO: VotingMechanismConfig = {
  initialWeight: 0,
  stakingContractAccountId: METAPOOL_LIQUID_STAKING_CONTRACT_ACCOUNT_ID,
  documentUrl: "https://docs.google.com/document/d/1P5iSBBSuh7nep29r7N3S-g4Y1bDbF4xLU_3v7XHmJR8",

  voteWeightAmplificationRules: [
    {
      name: "Human Verification",
      description: "Human-verified Users: Votes are weighted at 10% for verified users [KYC].",
      participantStatsPropertyKey: "isHumanVerified",
      comparator: "isTruthy",
      expectation: true,
      amplificationPercent: 10,
    },

    {
      name: "Up to 10,000 votes in mpDAO",

      description:
        "Users with at least 10,000 votes in mpDAO governance receive an additional 25% vote weight.",

      participantStatsPropertyKey: "votingPower",
      comparator: "gte",
      threshold: 10000,
      amplificationPercent: 25,
    },

    {
      name: "Up to 25,000 votes in mpDAO",

      description:
        "Users with at least 25,000 votes in mpDAO governance receive an additional 25% vote weight.",

      participantStatsPropertyKey: "votingPower",
      comparator: "gte",
      threshold: 25000,
      amplificationPercent: 25,
    },

    {
      name: "Stake at least 2 Near",
      description: "Users with at least 2 stNEAR staked in Meta Pool receive a 10% boost.",
      participantStatsPropertyKey: "stakingTokenBalance",
      comparator: "gte",
      threshold: 2,
      amplificationPercent: 10,
    },

    {
      name: "Stake at least 10 Near",

      description:
        "Users with at least 10 stNEAR staked in Meta Pool receive a 30% boost in addition to the 10% boost from staking at least 2 Near.",

      participantStatsPropertyKey: "stakingTokenBalance",
      comparator: "gte",
      threshold: 10,
      amplificationPercent: 30,
    },
  ],
};

export const isVotingEnabled = ({ potId }: ByPotId) => VOTING_SUPPORTED_POT_IDS.includes(potId);
