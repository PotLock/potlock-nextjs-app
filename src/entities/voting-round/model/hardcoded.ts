import { METAPOOL_LIQUID_STAKING_CONTRACT_ACCOUNT_ID } from "@/common/_config";

import { VotingMechanismConfig } from "../types";

// TODO: Convert into publicly available configurable JSON ( Pots V2 milestone ) and validate with Zod
export const VOTING_ROUND_CONFIG_MPDAO: VotingMechanismConfig = {
  initialWeight: 0,
  basicWeight: 1,
  stakingContractAccountId: METAPOOL_LIQUID_STAKING_CONTRACT_ACCOUNT_ID,
  documentUrl: "https://docs.google.com/document/d/1P5iSBBSuh7nep29r7N3S-g4Y1bDbF4xLU_3v7XHmJR8",

  voteWeightAmplificationRules: [
    {
      name: "Human Verification",
      description: "Human-verified Users: Votes are weighted at 10% for verified users [KYC].",
      criteria: "KYC",
      voterProfileParameter: "isHumanVerified",
      comparator: "boolean",
      expectation: true,
      amplificationPercent: 10,
    },

    {
      name: "Up to 10,000 votes in mpDAO",

      description:
        "Users with at least 10,000 votes in mpDAO governance receive an additional 25% vote weight.",

      criteria: "VotingPower",
      voterProfileParameter: "votingPower",
      comparator: "gte",
      threshold: 10000,
      amplificationPercent: 25,
    },

    {
      name: "Up to 25,000 votes in mpDAO",

      description:
        "Users with at least 25,000 votes in mpDAO governance receive an additional 25% vote weight.",

      criteria: "VotingPower",
      voterProfileParameter: "votingPower",
      comparator: "gte",
      threshold: 25000,
      amplificationPercent: 25,
    },

    {
      name: "Stake at least 2 stNEAR",
      description: "Users with at least 2 stNEAR staked in Meta Pool receive a 10% boost.",
      criteria: "Staking",
      voterProfileParameter: "stakingTokenBalance",
      comparator: "gte",
      threshold: 2,
      amplificationPercent: 10,
    },

    {
      name: "Stake at least 10 stNEAR",

      description:
        "Users with at least 10 stNEAR staked in Meta Pool receive a 30% boost in addition to the 10% boost from staking at least 2 stNEAR.",

      criteria: "Staking",
      voterProfileParameter: "stakingTokenBalance",
      comparator: "gte",
      threshold: 10,
      amplificationPercent: 30,
    },
  ],
};
