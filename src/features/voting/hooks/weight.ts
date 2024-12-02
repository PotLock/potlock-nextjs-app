import { ByPotId } from "@/common/api/indexer";
import { METAPOOL_MPDAO_VOTING_POWER_DECIMALS } from "@/common/contracts/metapool";
import { useAuthSession } from "@/modules/session";

import { isVotingEnabled } from "../utils/voting";

/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 *
 * - Human-verified Users: Votes are weighted at 10% for verified users [KYC].
 *
 * - mpDAO Governance Participants: Users with at least 10,000 votes in mpDAO governance
 *  receive an additional 25% vote weight. Those with 25,000 votes gain another 25%.
 *
 * - stNEAR Stakeholders: Users with 2 stNEAR staked in Meta Pool receive a 10% boost,
 *  and those with 10 stNEAR staked gain a 30% vote weight increase.
 *
 * https://docs.google.com/document/d/1P5iSBBSuh7nep29r7N3S-g4Y1bDbF4xLU_3v7XHmJR8
 */
export const usePotUserVoteWeight = ({ potId }: ByPotId) => {
  const { accountId } = useAuthSession();
  const isVotingBasedPot = isVotingEnabled({ potId });

  // TODO: calculate voting amplifiers
  METAPOOL_MPDAO_VOTING_POWER_DECIMALS;
};
