import { useMemo } from "react";

import { Big } from "big.js";

import { indexer } from "@/common/api/indexer";
import { METAPOOL_MPDAO_VOTING_POWER_DECIMALS } from "@/common/contracts/metapool";
import { stringifiedU128ToBigNum } from "@/common/lib";
import { tokenHooks } from "@/common/services/token";
import { ByAccountId, TokenId } from "@/common/types";
import { useIsHuman } from "@/entities/core";

import { VoterProfile } from "../types";

export type VoterProfileInputs = Partial<ByAccountId> & {
  stakingContractAccountId?: TokenId;
};

/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 *
 * Though it is in the process of being refactored, the job is not entirely done yet.
 */
export const useVoterProfile = ({
  accountId,
  stakingContractAccountId,
}: VoterProfileInputs): VoterProfile => {
  const { isHumanVerified } = useIsHuman(accountId);
  const { data: mpDaoVoterInfo } = indexer.useMpdaoVoterInfo({ accountId });

  const { data: stakingToken } = tokenHooks.useToken({
    tokenId: stakingContractAccountId ?? "noop",
    balanceCheckAccountId: accountId,
  });

  return useMemo(
    () => ({
      isHumanVerified,
      stakingTokenBalance: stakingToken ? (stakingToken.balance ?? Big(0)) : undefined,
      stakingTokenBalanceUsd: stakingToken ? (stakingToken.balanceUsd ?? Big(0)) : undefined,

      votingPower:
        mpDaoVoterInfo?.locking_positions.reduce(
          (sum, { voting_power }) =>
            sum.add(stringifiedU128ToBigNum(voting_power, METAPOOL_MPDAO_VOTING_POWER_DECIMALS)),

          Big(0),
        ) ?? Big(0),
    }),

    [isHumanVerified, stakingToken, mpDaoVoterInfo?.locking_positions],
  );
};
