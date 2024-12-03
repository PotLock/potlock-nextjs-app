import { useMemo } from "react";

import { Big } from "big.js";

import { METAPOOL_LIQUID_STAKING_CONTRACT_ACCOUNT_ID } from "@/common/_config";
import { ByPotId, indexer } from "@/common/api/indexer";
import { METAPOOL_MPDAO_VOTING_POWER_DECIMALS } from "@/common/contracts/metapool";
import { u128StringToBigNum } from "@/common/lib";
import { ftService } from "@/common/services";
import { useIsHuman } from "@/entities/core";
import { useAuthSession } from "@/entities/session";

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
export const usePotUserVoteWeight = ({ potId: _ }: ByPotId) => {
  const basicWeight = Big(1);
  const { accountId } = useAuthSession();
  const { nadaBotVerified } = useIsHuman(accountId);

  const { data: stNear } = ftService.useRegisteredToken({
    tokenId: METAPOOL_LIQUID_STAKING_CONTRACT_ACCOUNT_ID,
  });

  const stNearBalance = useMemo(() => stNear?.balance ?? Big(0), [stNear]);
  const { data: voterInfo } = indexer.useMpdaoVoterInfo({ accountId });

  const votingPower = useMemo(
    () => u128StringToBigNum(voterInfo?.voting_power ?? "0", METAPOOL_MPDAO_VOTING_POWER_DECIMALS),
    [voterInfo?.voting_power],
  );

  return useMemo(() => {
    const finalWeightBig = basicWeight
      .add(
        // Human verification bonus: +10%
        nadaBotVerified ? 0.1 : 0,
      )
      .add(
        // mpDAO Governance bonus: +25% for 10k+ votes
        votingPower.gte(10000) ? 0.25 : 0,
      )
      .add(
        // mpDAO Governance bonus: additional +25% for 25k+ votes
        votingPower.gte(25000) ? 0.25 : 0,
      )
      .add(
        // stNEAR staking bonus: +30% for 10+ stNEAR
        ((stNearBalance.gte(10) ? 0.3 : undefined) ??
          // stNEAR staking bonus: +10% for 2+ stNEAR
          stNearBalance.gte(2))
          ? 0.1
          : 0,
      );

    return finalWeightBig.toNumber();
  }, [basicWeight, nadaBotVerified, votingPower, stNearBalance]);
};
