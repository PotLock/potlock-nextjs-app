import { ByPotId } from "@/common/api/indexer";
import { MpDaoVoter } from "@/common/contracts/metapool";
import { useAuthSession } from "@/modules/auth";

import { isPotVotingBased } from "../utils/voting";

export const POT_VOTER_MOCK: MpDaoVoter = {
  voter_id: "lucascasp.near",
  balance_in_contract: "0",

  locking_positions: [
    {
      index: 0,
      amount: "1447929400",
      locking_period: 300,
      voting_power: "7239647000000000000000000000",
      unlocking_started_at: null,
      is_unlocked: false,
      is_unlocking: false,
      is_locked: true,
    },
  ],

  voting_power: "0",

  vote_positions: [
    {
      votable_address: "metastaking.app",
      votable_object_id: "luganodes.pool.near",
      voting_power: "7239647000000000000000000000",
    },
  ],
};

/**
 * - Human-verified Users: Votes are weighted at 10% for verified users [KYC].
 *
 * - mpDAO Governance Participants: Users with at least 10,000 votes in mpDAO governance
 *  receive an additional 25% vote weight. Those with 25,000 votes gain another 25%.
 *
 * - stNEAR Stakeholders: Users with 2 stNEAR staked in Meta Pool receive a 10% boost,
 *  and those with 10 stNEAR staked gain a 30% vote weight increase.
 */
export const usePotUserVoteWeight = ({ potId }: ByPotId) => {
  const { accountId } = useAuthSession();
  const isVotingBasedPot = isPotVotingBased({ potId });

  // TODO: calculate voting amplifiers
};
