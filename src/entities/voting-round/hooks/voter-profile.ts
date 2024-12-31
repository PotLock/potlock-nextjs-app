import { useMemo } from "react";

import { Big } from "big.js";

import { useIsHuman } from "@/common/_deprecated/useIsHuman";
import { indexer } from "@/common/api/indexer";
import { METAPOOL_MPDAO_VOTING_POWER_DECIMALS } from "@/common/contracts/metapool";
import { stringifiedU128ToBigNum } from "@/common/lib";
import { ByAccountId, TokenId } from "@/common/types";
import { useToken } from "@/entities/_shared/token";

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
  const { data: voterInfo } = indexer.useMpdaoVoterInfo({ accountId });

  const stakingTokenId = useMemo(
    () => voterInfo?.staking_token_id || stakingContractAccountId,
    [stakingContractAccountId, voterInfo?.staking_token_id],
  );

  const { data: stakingToken } = useToken({
    enabled: stakingTokenId !== undefined,
    tokenId: stakingTokenId as TokenId,
  });

  return useMemo(
    () => ({
      isHumanVerified,

      stakingTokenBalance:
        voterInfo?.staking_token_balance && stakingToken
          ? stringifiedU128ToBigNum(
              voterInfo?.staking_token_balance,
              stakingToken.metadata.decimals,
            )
          : undefined,

      votingPower:
        voterInfo?.locking_positions?.reduce(
          (sum, { voting_power }) =>
            sum.add(stringifiedU128ToBigNum(voting_power, METAPOOL_MPDAO_VOTING_POWER_DECIMALS)),

          Big(0),
        ) ?? Big(0),
    }),

    [isHumanVerified, stakingToken, voterInfo?.locking_positions, voterInfo?.staking_token_balance],
  );
};
