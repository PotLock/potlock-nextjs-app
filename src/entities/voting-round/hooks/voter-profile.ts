import { useMemo } from "react";

import { Big } from "big.js";

import { indexer } from "@/common/api/indexer";
import { sybilResistanceContractHooks } from "@/common/contracts/core/sybil-resistance";
import { METAPOOL_MPDAO_VOTING_POWER_DECIMALS } from "@/common/contracts/metapool";
import { indivisibleUnitsToBigNum } from "@/common/lib";
import { ByAccountId, type ConditionalActivation, TokenId } from "@/common/types";
import { useToken } from "@/entities/_shared/token";

import { VoterProfile } from "../types";

export type VoterProfileInputs = ByAccountId & {
  stakingContractAccountId?: TokenId;
};

/**
 * Heads up! At the moment, this hook only covers one specific use case,
 *  as it's built for the mpDAO milestone.
 *
 * Though it is in the process of being refactored, the job is not entirely done yet.
 */
export const useVoterProfile = ({
  enabled = true,
  accountId,
  stakingContractAccountId,
}: VoterProfileInputs & ConditionalActivation): VoterProfile => {
  const { data: isHuman } = sybilResistanceContractHooks.useIsHuman({ accountId });
  const { data: voterInfo } = indexer.useMpdaoVoter({ enabled, accountId });

  const tokenId = useMemo(
    () => stakingContractAccountId ?? voterInfo?.voter_data.staking_token_id,
    [stakingContractAccountId, voterInfo?.voter_data.staking_token_id],
  );

  const { data: stakingToken } = useToken({
    enabled: tokenId !== undefined,
    tokenId: tokenId as TokenId,
  });

  return useMemo(
    () => ({
      accountId,
      isHumanVerified: isHuman ?? false,

      stakingTokenBalance:
        voterInfo?.voter_data.staking_token_balance && stakingToken
          ? indivisibleUnitsToBigNum(
              voterInfo?.voter_data.staking_token_balance,
              stakingToken.metadata.decimals,
            )
          : undefined,

      votingPower:
        voterInfo?.voter_data.locking_positions?.reduce(
          (sum, { voting_power }) =>
            sum.add(indivisibleUnitsToBigNum(voting_power, METAPOOL_MPDAO_VOTING_POWER_DECIMALS)),

          Big(0),
        ) ?? Big(0),
    }),

    [
      accountId,
      isHuman,
      stakingToken,
      voterInfo?.voter_data.locking_positions,
      voterInfo?.voter_data.staking_token_balance,
    ],
  );
};
