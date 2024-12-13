import { useMemo } from "react";

import { Big } from "big.js";
import useSWR from "swr";

import { indexer } from "@/common/api/indexer";
import { METAPOOL_MPDAO_VOTING_POWER_DECIMALS } from "@/common/contracts/metapool";
import { isAccountId, stringifiedU128ToBigNum } from "@/common/lib";
import { ftService } from "@/common/services";
import { ByAccountId, TokenId } from "@/common/types";
import { useIsHuman } from "@/entities/core";

import { VotingParticipantStats } from "../types";

export type VotingParticipantStatsInputs = Partial<ByAccountId> & {
  stakingContractAccountId?: TokenId;
};

/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 *
 * Though it is in the process of being refactored, the job is not entirely done yet.
 */
export const useVotingParticipantStats = ({
  accountId,
  stakingContractAccountId,
}: VotingParticipantStatsInputs): VotingParticipantStats => {
  const { isHumanVerified } = useIsHuman(accountId);
  const { data: mpDaoVoterInfo } = indexer.useMpdaoVoterInfo({ accountId });

  const { data: stakingTokenData } = useSWR(stakingContractAccountId ?? null, (tokenId) =>
    isAccountId(tokenId) ? ftService.getFtData({ accountId, tokenId }) : undefined,
  );

  return useMemo(
    () => ({
      isHumanVerified,
      stakingTokenBalance: stakingTokenData ? (stakingTokenData.balance ?? Big(0)) : undefined,

      stakingTokenBalanceUsd: stakingTokenData
        ? (stakingTokenData?.balanceUsd ?? Big(0))
        : undefined,

      votingPower:
        mpDaoVoterInfo?.locking_positions.reduce(
          (sum, position) =>
            sum.add(
              stringifiedU128ToBigNum(position.voting_power, METAPOOL_MPDAO_VOTING_POWER_DECIMALS),
            ),

          Big(0),
        ) ?? Big(0),
    }),

    [isHumanVerified, stakingTokenData, mpDaoVoterInfo?.locking_positions],
  );
};
