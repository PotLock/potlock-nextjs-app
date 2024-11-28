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

export const usePotUserVoteWeight = ({ potId }: ByPotId) => {
  const { accountId } = useAuthSession();
  const isVotingBasedPot = isPotVotingBased({ potId });

  // TODO: calculate voting amplifiers
};
