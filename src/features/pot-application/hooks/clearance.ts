import { useMemo } from "react";

import { prop } from "remeda";

import { PLATFORM_NAME } from "@/common/_config";
import { ByPotId, indexer } from "@/common/api/indexer";
import { METAPOOL_MPDAO_VOTING_POWER_DECIMALS } from "@/common/contracts/metapool";
import { stringifiedU128ToBigNum } from "@/common/lib";
import { authService, tokenService } from "@/common/services";
import { ClearanceCheckResult } from "@/common/types";

import { POT_APPLICATION_REQUIREMENTS_MPDAO } from "../constants";

// TODO: refactor to support multi-mechanism for the V2 milestone
/**
 * Heads up! At the moment, this hook only covers one specific voting round,
 *  as it's built for the mpDAO milestone.
 */
export const usePotApplicationUserClearance = ({
  potId,
  hasVoting,
}: ByPotId & { hasVoting?: boolean }): ClearanceCheckResult => {
  const { staking } = POT_APPLICATION_REQUIREMENTS_MPDAO;
  const { data: pot } = indexer.usePot({ potId });

  const { accountId, isAccountInfoLoading, isVerifiedPublicGoodsProvider } =
    authService.useUserSession();

  const { data: voterInfo } = indexer.useMpdaoVoterInfo({ accountId });

  const { data: stakingToken } = tokenService.useSupportedToken({
    balanceCheckAccountId: accountId,
    tokenId: staking.tokenId,
  });

  return useMemo(() => {
    const requirements = [
      ...(pot?.sybil_wrapper_provider === "string"
        ? [
            {
              title: `Verified Project on ${PLATFORM_NAME}`,
              isFulfillmentAssessmentPending: isAccountInfoLoading,
              isSatisfied: isVerifiedPublicGoodsProvider,
            },
          ]
        : []),

      ...(hasVoting
        ? [
            {
              title: `An equivalent of ${staking.minAmountUsd} USD staked in NEAR on ${staking.platformName}`,
              isSatisfied: stakingToken?.balanceUsd?.gte(staking.minAmountUsd) ?? false,
            },

            {
              title: "Voting power 5000 or more",

              isSatisfied: stringifiedU128ToBigNum(
                voterInfo?.voting_power ?? "0",
                METAPOOL_MPDAO_VOTING_POWER_DECIMALS,
              ).gte(5000),
            },
          ]
        : []),
    ];

    return {
      requirements,

      isEveryRequirementSatisfied:
        requirements.length > 0 ? requirements.every(prop("isSatisfied")) : true,

      error: null,
    };
  }, [
    hasVoting,
    isAccountInfoLoading,
    isVerifiedPublicGoodsProvider,
    pot?.sybil_wrapper_provider,
    staking.minAmountUsd,
    staking.platformName,
    stakingToken?.balanceUsd,
    voterInfo?.voting_power,
  ]);
};
